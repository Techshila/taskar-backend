class ApiResponse {
    constructor(
        status=421,
        message="A response without a message provided",
        data = null,
        success=true,
        ) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success=success;

    }

}
export default ApiResponse;