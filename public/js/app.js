import * as Vue from "./vue.js";
import modal from "./modal.js";

Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            desc: "",
            username: "",
            file: null,
            id: null,
            selectedImageId: null,
        };
    },
    components: {
        "image-modal": modal,
    },
    mounted: function () {
        fetch("/images.json")
            .then((images) => images.json())
            .then((images) => {
                this.images = images.rows;
                console.log("our images:", images);
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
            console.log("click", this.selectedImageId);
            this.selectedImageId = selectedImageId;
            document.querySelector(".images").classList.add("blur");
        },
        closeModal() {
            this.selectedImageId = null;
            document.querySelector(".images").classList.remove("blur");
        },
    },
}).mount("#main");
