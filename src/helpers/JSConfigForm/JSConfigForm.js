const jsConfigForm = (elementType, elementConfig, placeholder, value, required) => {
    if (value === undefined)
    {
        value = '';
    }
    let returnedObject = {
        elementType: elementType,
        elementConfig: {
          type: elementConfig,
          placeholder: placeholder
        },
        value: value
    };

    if (required==="required") {
        returnedObject['validation']={ required: true};
        returnedObject['valid']=false;
        returnedObject['touched']=false;
    }


    return (returnedObject);
}

export default jsConfigForm;
