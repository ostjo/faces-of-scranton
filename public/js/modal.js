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
    props: ["id"],
    mounted: function () {
        fetch(`/selected-image/${this.id}`)
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
                    <div class="lightbox">
                        <img :src="url" :alt="title">
                        <div>
                            <div @click="closeModal" class="close"></div>
                            <h2>{{title}}</h2>
                            <h4>{{desc}}</h4>
                        </div>
                        <p>Uploaded by {{username}} {{date}}</p>
                    </div>
                </div>`,
};
