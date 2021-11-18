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
    },
    template: `<div class="comments" style="position: fixed; z-index: 100; top: 0; left: 0">{{comment}}</div>`,
};
