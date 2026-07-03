export default class Calculator {
    private expression = "";

    getDisplay(){
        return this.expression || "0";
    }

    append(value: string){
        this.expression += value;
    }
    clear(){
        this.expression = "";
    }
    backspace(){
        this.expression = this.expression.slice(0, -1);
    }

    solve(): string {
        try{
            const result = Function(`return (${this.expression})`)();
            this.expression = String(result);

            return this.expression;
        } catch {
            this.expression = "Error";
            return this.expression;
        }
    }
}