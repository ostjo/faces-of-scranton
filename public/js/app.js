import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            desc: "",
            username: "",
            file: null,
        };
    },
    mounted: function () {
        fetch("/images.json")
            .then((images) => images.json())
            .then((images) => {
                this.images = images.rows;
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
            formData.append("username", this.username);
            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((images) => images.json())
                .then((images) => {
                    // this.images = [...this.images, images.rows];
                    // splice(index, numberToDelete, valueToAdd)
                    this.images.splice(0, 0, images);
                    console.log("images coming back", this.images);
                });
        },
    },
}).mount("#main");
