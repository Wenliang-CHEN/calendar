function Event () {
    this.name = '';
    this.date = '';
    this.remarks = '';
    this.type = '';

    this.error = {};

    this.processJSON = function(jsonObj){
        this.name = jsonObj.name;
        this.date = jsonObj.date;
        this.type = jsonObj.type;
        this.remarks = jsonObj.remarks;
    }

    this.validate = function(){
        this.error = {};

        if(this.name == null || this.name == ''){
            this.error.name = 'Name of the event cannot be blank.';
        }

        return (Object.keys(error).length == 0);
    }

    this.getEventTypeText = function(){
        return this.type == 0? 'Normal':'Urgent'
    }
}