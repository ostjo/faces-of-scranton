export default {
    data() {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    props: ["selectedImageId"],
    mounted: function () {
        // GET request to retrieve all comments made about the image currently shown in the modal
        fetch(`/comments/${this.selectedImageId}`)
            .then((comments) => comments.json())
            .then((comments) => {
                this.comments = comments.rows;
            });
    },
    methods: {
        addComment() {
            fetch("/add-comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: this.username,
                    comment: this.comment,
                    imageId: this.selectedImageId,
                }),
            })
                .then((comment) => comment.json())
                .then((comment) => {
                    console.log("comment coming in: ", comment);
                    // insert the newly uploaded image to the beginning of the images array
                    this.comments.unshift(comment);
                });
        },
    },
    template: `<div id="comment-container">
                    <p>{{comments.length}} comments</p>
                    <div v-if="comments.length > 0" id="comments">
                        <div v-for="comment in comments">
                        <div class="comment">
                            <p class="username">{{comment.username}} <span class="date">{{comment.publDate}}</span></p>
                            <h5 class="comment-txt">{{comment.comment}}</h5>
                        </div>
                    </div>
                    </div>
                    <div class="add-comment">
                        <input v-model="username" name="username" type="text" placeholder="username">
                        <input v-model="comment" name="comment" type="text" placeholder="comment here">
                        <button class="dark" @click="addComment">submit</button>
                    </div>
                </div>`,
};
