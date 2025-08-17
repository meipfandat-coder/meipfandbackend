export class ErrorResponse extends Error{
    status: number;
    constructor(status:number, message:string){
        super();
        this.message=message;
        this.status=status;
    }
}