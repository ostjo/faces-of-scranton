import * as Vue from "./vue.js";
import modal from "./components/modal.js";

Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            desc: "",
            username: "",
            file: null,
            id: null,
            selectedImageId: location.pathname.slice(1),
            nextId: null,
            prevId: null,
            moreImages: undefined,
        };
    },
    components: {
        "image-modal": modal,
    },
    mounted: function () {
        // we need the window to listen to the url changing and set the selectedImageId appropriately
        // so that a rerendering is triggered
        window.addEventListener(
            "popstate",
            () => (this.selectedImageId = location.pathname.slice(1))
        );
        fetch("/images.json")
            .then((images) => images.json())
            .then((images) => {
                this.images = images.rows;
                // check whether there are more images to show
                this.checkLoadMoreButton(images);
            });
    },
    methods: {
        setFile(e) {
            // method to grab the input.files property and
            // set it as the value of this.file
            this.file = e.target.files[0];
        },
        upload() {
            const formData = new FormData();
            // append the information we wand to send along in
            // smaller bits (as a new FormData)
            formData.append("file", this.file);
            formData.append("title", this.title);
            formData.append("desc", this.desc);
            formData.append("id", this.id);
            formData.append("username", this.username);
            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((image) => image.json())
                .then((image) => {
                    // insert the newly uploaded image to the beginning of the images array
                    this.images.unshift(image);
                });
        },
        click(selectedImageId) {
            this.selectedImageId = selectedImageId;
            console.log("click", this.selectedImageId);
            history.pushState({}, "", `/${this.selectedImageId}`);
            document.querySelector(".images").classList.add("blur");
            document.querySelector("nav").classList.add("blur");
            document.querySelector("#upload").classList.add("blur");
            document.querySelector("body").classList.add("disable-scroll");
        },
        closeModal() {
            this.selectedImageId = null;
            document.querySelector(".images").classList.remove("blur");
            document.querySelector("nav").classList.remove("blur");
            document.querySelector("#upload").classList.remove("blur");
            document.querySelector("body").classList.remove("disable-scroll");
        },
        loadMore() {
            // To get more images from the db:
            // 1. get smallest id of currently shown images
            let smallestImageId = this.images[this.images.length - 1].id;
            // 2. make fetch GET request to server with smallestImageId
            fetch(`/more-images/${smallestImageId}`)
                .then((images) => images.json())
                .then((images) => {
                    images.rows.forEach((image) => this.images.push(image));
                    // check whether there are more images to show
                    this.checkLoadMoreButton(images);
                });
        },
        checkLoadMoreButton(images) {
            this.moreImages =
                this.images[this.images.length - 1].id !==
                images.rows[0].lowestId;
        },
        showNext(nextId) {
            // set the selectedImageId to nextId
            this.selectedImageId = nextId;
            console.log(this.selectedImageId);
        },
        showPrev(prevId) {
            this.selectedImageId = prevId;
            console.log(this.selectedImageId);
        },
    },
}).mount("#main");
