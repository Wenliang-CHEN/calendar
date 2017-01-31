function Event () {
    this.name = '';
    this.date = '';
    this.remarks = '';
    this.type = '';

    this.errors = {};

    this.processJSON = function(jsonObj){
        this.name = jsonObj.name;
        this.date = jsonObj.date;
        this.type = jsonObj.type;
        this.remarks = jsonObj.remarks;
    }

    this.validate = function(){
        this.errors = {};

        if(this.name == null || this.name == ''){
            this.errors.name = 'Name of the event cannot be blank.';
        }

        if(this.type == null || this.type == ''){
            this.errors.type = 'Type of the event cannot be blank.';
        }

        console.log(this.errors);

        return (Object.keys(this.errors).length == 0);
    }

    this.getEventTypeText = function(){
        return this.type == 0? 'Normal':'Urgent'
    }

    this.getColorClassByType = function(){
        var color = '';
        if(this.type == 0){
            color = 'blue';
        } else if(this.type == 1){
            color = 'red';
        }

        return color;
    }
}