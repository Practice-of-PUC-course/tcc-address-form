var api={
    call:function(baseUrl,fn,method,data){
        if(!method) method='GET';
        if(!data) data={};
        $.ajax( {cache: false, url: baseUrl,type: method, data} )
            .done(function(response) {
                fn(response)
            })
            .fail(function(reason) {
                console.error(JSON.stringify(reason));
            })
            .always(function() {
                console.log( "complete" );
            });
    }
};

var model={
    path: conf.registry_api+"/model",

    resetDatabaseModel:function(){
        if(confirm("A base de dados será restaurada aos padrões de teste. Confirma?")){
            api.call(this.path,(res)=>{
                console.log("Ok, base de dados recriada. res:"+res);
            });
        }
    }
};

var address={
    path: conf.registry_api+"/address",

    getAddress:function(userid,fn){
        api.call(this.path+"/"+userid,fn);
    },

    createAddress:function(userid,fn){
        api.call(this.path+"/"+userid,fn,'POST');
    }

};

var user={
    path: conf.registry_api+"/user",

    getUsers:function(fn){
        api.call(this.path,fn);
    },

    getUserById:function(id,fn){
        api.call(this.path+"/"+id,fn);
    }
};

var usertype={
    path: conf.registry_api+"/usertype",

    getTypes:function(fn){
        api.call(this.path,fn);
    },

    getTypeById:function(id,fn){
        api.call(this.path+"/"+id,fn);
    }
};

var geo={
    path: conf.geocode_api+"/location",

    /** formValues={street:street,housenumber:housenumber,county:county,state:state} */
    getLocation:function(formValues,fn){
        let params="?street="+formValues.street+
        "&number="+formValues.housenumber+
        "&county="+formValues.county+
        "&state="+formValues.state;
        params=encodeURIComponent(params);
        api.call(this.path+"/"+params,fn);
    }
};