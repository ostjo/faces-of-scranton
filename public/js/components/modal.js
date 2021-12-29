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
            prevId: null,
            nextId: null,
            tags: [],
        };
    },
    props: ["selectedImageId", "selectedTag"],
    components: {
        "comments-modal": comments,
    },
    mounted: function () {
        this.getImageById(this.selectedImageId);
    },
    watch: {
        // whenever selectedImageId changes, this function will run
        selectedImageId(id) {
            this.getImageById(id);
        },
    },
    methods: {
        getImageById(id) {
            fetch(`/selected-image/${id}`)
                .then((resp) => {
                    if (resp.status === 500) {
                        // if someone passes a string instead a number, return null
                        return null;
                    }
                    return resp.json();
                })
                .then((results) => {
                    const [image, tags] = results;

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
                    this.prevId = image.rows[0].prevId;
                    this.nextId = image.rows[0].nextId;
                    this.tags = tags.rows;

                    // keep track on whether the fetch is completely done and only render the modal
                    // as soon as the fetch is complete (prevents flickering)
                    this.reqComplete = true;
                });
        },
        closeModal() {
            this.$emit("close");
        },
        filterByTag(tag) {
            this.$emit("filtering", tag);
        },
        showPrev() {
            this.$emit("prev", this.prevId);
        },
        showNext() {
            this.$emit("next", this.nextId);
        },
    },
    template: `<div v-if="reqComplete" class="modal">
                    <div :style="{visibility: nextId != null ? 'visible' : 'hidden'}" class="arrow to-left" @click="showNext">
                        <img v-if="selectedTag === ''" src="./images/arrow.svg">    
                        <img v-else src="../images/arrow.svg">    
                    </div>
                    <div class="lightbox">
                        <img :src="url" :alt="title">
                        <p>Uploaded by {{username}} {{date}}</p>
                        <div @click="closeModal" class="close absolute"></div>
                        <div>
                            <h2>{{title}}</h2>
                            <h4>{{desc}}</h4>
                            <div class="tags">
                                <a v-if="tags.length > 0" v-for="tag in tags" class="tag xs" :href="'/' + tag.tag" @click.prevent="closeModal(); filterByTag(tag.tag);">
                                    <span>{{tag.tag}}</span>
                                </a>
                            </div>
                        </div>
                        <comments-modal :selected-image-id="selectedImageId"></comments-modal>
                    </div>
                    <div :style="{visibility: prevId != null ? 'visible' : 'hidden'}" class="arrow" @click="showPrev">
                        <img v-if="selectedTag === ''" src="./images/arrow.svg">    
                        <img v-else src="../images/arrow.svg">    
                    </div>
                </div>`,
};
