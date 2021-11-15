import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
        };
    },
    mounted: function () {
        fetch("/images.json")
            .then((images) => images.json())
            .then((images) => {
                console.log("images coming back", images.rows);
                this.images = images.rows;
            });
    },
}).mount("#main");
