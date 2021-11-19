import comments from "./comments.js";

export default {
    data() {
        return {
            url: "",
            title: "",
            desc: "",
            username: "",
            date: "",
            reqComplete: false,
        };
    },
    props: ["selectedImageId"],
    components: {
        "comments-modal": comments,
    },
    mounted: function () {
        fetch(`/selected-image/${this.selectedImageId}`)
            .then((resp) => {
                if (resp.status === 500) {
                    // if someone passes a string instead a number, return null
                    return null;
                }
                return resp.json();
            })
            .then((image) => {
                if (image === null || image.rows.length === 0) {
                    // the db did not find any image with the requested id, so close the modal and replace the state
                    this.$emit("close");
                    return history.replaceState({}, "", "/");
                }
                this.url = image.rows[0].url;
                this.title = image.rows[0].title;
                this.desc = image.rows[0].desc;
                this.username = image.rows[0].username;
                this.date = image.rows[0].publDate;

                // keep track on whether the fetch is completely done and only render the modal
                // as soon as the fetch is complete (prevents flickering)
                this.reqComplete = true;
            });
    },
    methods: {
        closeModal() {
            this.$emit("close");
            history.pushState({}, "", "/");
        },
    },
    template: `<div v-if="reqComplete" class="modal">
                    <div class="arrow to-left">
                        <img src="./images/arrow.svg">    
                    </div>
                    <div class="lightbox">
                        <img :src="url" :alt="title">
                        <p>Uploaded by {{username}} {{date}}</p>
                        <div @click="closeModal" class="close"></div>
                        <div>
                            <h2>{{title}}</h2>
                            <h4>{{desc}}</h4>
                        </div>
                        <comments-modal :selected-image-id="selectedImageId"></comments-modal>
                    </div>
                    <div class="arrow">
                        <img src="./images/arrow.svg">    
                    </div>
                </div>`,
};
