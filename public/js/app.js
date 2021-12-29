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
            selectedImageId: parseInt(location.pathname.slice(1)),
            selectedTag: "",
            nextId: null,
            prevId: null,
            moreImages: false,
            tag: "",
            tags: [],
        };
    },
    components: {
        "image-modal": modal,
    },
    mounted: function () {
        // we need the window to listen to the url changing and set the selectedImageId appropriately
        // so that a rerendering is triggered
        window.addEventListener("popstate", () => {
            this.selectedImageId = parseInt(location.pathname.slice(1));
            this.selectedTag = location.pathname.slice(1);
        });
        fetch("/images.json")
            .then((images) => images.json())
            .then((images) => {
                this.images = images.rows;
                // check whether there are more images to show
                this.checkLoadMoreButton(images);
            });
    },
    watch: {
        selectedTag(tag) {
            // get images with tag
            if (this.selectedTag !== "") {
                let slashPos = tag.indexOf("/");
                if (slashPos !== -1) {
                    tag = tag.slice(0, slashPos);
                }
                fetch(`/filter-images/${tag}`)
                    .then((images) => images.json())
                    .then((images) => {
                        this.images = images.rows;
                        console.log(this.images);
                        console.log(this.checkLoadMoreButton(images));
                        this.checkLoadMoreButton(images);
                    });
            } else {
                fetch("/images.json")
                    .then((images) => images.json())
                    .then((images) => {
                        this.images = images.rows;
                        // check whether there are more images to show
                        this.checkLoadMoreButton(images);
                    });
            }
        },
        // selectedImageId(id) {
        //     console.log("the id:", id);
        //     if (typeof id == "number") {
        //         this.selectedImageId = id;
        //     }
        //     // else {
        //     //     this.closeModal();
        //     // }
        // },
    },
    methods: {
        sayHi() {
            for (let i = 0; i < this.tag.length; i++) {
                if (this.tag.charAt(i) === "," || this.tag.charAt(i) === " ") {
                    this.tags.push(this.tag.slice(0, i));
                    this.tag = ""; // add the tag to the tags array and empty the tag input field
                }
            }
        },
        deleteTag(selecTag) {
            for (let i = 0; i < this.tags.length; i++) {
                if (this.tags[i].startsWith(selecTag)) {
                    this.tags.splice(i, 1);
                }
            }
        },
        setFile(e) {
            // method to grab the input.files property and
            // set it as the value of this.file
            this.file = e.target.files[0];
        },
        upload() {
            const formData = new FormData();
            // append the information we wand to send along in
            // smaller bits (as a new FormData)
            console.log("before sending over: ", this.tags);
            const testArr = ["hi", "cool", "nice"];
            console.log("sanity check: ", testArr);

            formData.append("file", this.file);
            formData.append("title", this.title);
            formData.append("desc", this.desc);
            formData.append("id", this.id);
            formData.append("username", this.username);
            formData.append("tags", this.tags);
            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((image) => image.json())
                .then((image) => {
                    // insert the newly uploaded image to the beginning of the images array
                    this.images.unshift(image);
                    // reset the input fields to initial state
                    this.file = null;
                    this.title = "";
                    this.desc = "";
                    // this.id = null;
                    this.username = "";
                    this.tags = [];
                });
        },
        click(selectedImageId) {
            this.selectedImageId = selectedImageId;
            console.log("click", this.selectedImageId);

            let url = "";
            if (this.selectedTag) {
                url = this.selectedTag + "/" + this.selectedImageId;
            } else {
                url = this.selectedImageId + "";
            }

            history.pushState({}, "", `/${url}`);
            document.querySelector(".images").classList.add("blur");
            document.querySelector("nav").classList.add("blur");
            document.querySelector("#upload").classList.add("blur");
            document.querySelector("body").classList.add("disable-scroll");
        },
        closeModal() {
            console.log("closing to: ", `/${this.selectedTag}`);
            history.pushState({}, "", `/${this.selectedTag}`);
            this.selectedImageId = null;
            // this.selectedTag = "";
            document.querySelector(".images").classList.remove("blur");
            document.querySelector("nav").classList.remove("blur");
            document.querySelector("#upload").classList.remove("blur");
            document.querySelector("body").classList.remove("disable-scroll");
        },
        filterByTag(tag) {
            history.pushState({}, "", `/${tag}`);
            this.selectedTag = tag;
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
            return (this.moreImages =
                this.images[this.images.length - 1].id !==
                images.rows[0].lowestId);
        },
        showNext(nextId) {
            // set the selectedImageId to nextId
            this.selectedImageId = nextId;
            history.pushState({}, "", `/${this.selectedImageId}`);
        },
        showPrev(prevId) {
            this.selectedImageId = prevId;
            history.pushState({}, "", `/${this.selectedImageId}`);
        },
        setUrl(imageId) {
            return this.selectedTag
                ? `/${location.pathname.slice(1)}/${imageId}`
                : `/${imageId}`;
        },
    },
}).mount("#main");
