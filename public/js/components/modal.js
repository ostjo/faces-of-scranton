import comments from "./comments.js";

export default {
    data() {
        return {
            url: "",
            title: "",
            desc: "",
            username: "",
            date: "",
        };
    },
    props: ["selectedImageId"],
    components: {
        "comments-modal": comments,
    },
    mounted: function () {
        fetch(`/selected-image/${this.selectedImageId}`)
            .then((image) => image.json())
            .then((image) => {
                this.url = image.url;
                this.title = image.title;
                this.desc = image.desc;
                this.username = image.username;
                this.date = image.publDate;
            });
    },
    methods: {
        closeModal() {
            this.$emit("close");
        },
    },
    template: `<div class="modal">
                    <comments-modal :selected-image-id="selectedImageId"></comments-modal>
                    <div class="lightbox">
                        <img :src="url" :alt="title">
                        <p>Uploaded by {{username}} {{date}}</p>
                        <div @click="closeModal" class="close"></div>
                        <div>
                            <h2>{{title}}</h2>
                            <h4>{{desc}}</h4>
                        </div>
                    </div>
                </div>`,
};
