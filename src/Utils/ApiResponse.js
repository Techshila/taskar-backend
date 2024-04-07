class ApiResponse {
    constructor(
        status=421,
        message="A response without a message provided",
        data = null,
        ) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success=true;

    }

}
export default ApiResponse;