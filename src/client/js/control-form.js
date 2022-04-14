
/**
 * API Results Handler and UI View
 */
 var controlForm={
    userdata:{
        userId:null,
        address:{}
    },

    initDisplays:function(){
        user.getUsers((users)=>{
            controlForm.displayUserList(users);
        });
    },

    setUserId:function(ev){
        let user={
            id:+ev.currentTarget.id,
            name:ev.currentTarget.text,
            description:ev.currentTarget.title
        };
        $('.username').val(user.name);
        controlForm.userdata.user=user;
        address.getAddress(user.id, (res)=>{
            if(res && user.id==res.userId){
                let values={
                    street:res.streetName,
                    housenumber:res.houseNumber,
                    county:res.countyName,
                    state:res.stateName,
                    id: res.id
                };
                controlForm.userdata.address=values;
                let ll={lng:res.location.coordinates[0],lat:res.location.coordinates[1]};
                controlForm.setFieldValues(values);
                mainMap.addMarker(ll,values);
                controlForm.displayGeneralMessage(controlForm.userdata.user.name+", seu endereço já foi cadastrado.");
            }else{
                let v={street:'',housenumber:'',county:'',state:''};
                controlForm.setFieldValues(v);
                controlForm.displayGeneralMessage(controlForm.userdata.user.name+", cadastre seu endereço.");
            }
        });
        controlForm.enableGeoBtn();
    },

    displayUserList:function(users){
        let dss= $('#useritens')
        users.forEach(
            u => {
                let a=$("<a></a>").text(u.name);
                a.addClass("dropdown-item");
                a.on("click",controlForm.setUserId);
                a.attr("title",u.description);
                a.attr("id",u.id);
                dss.append(a);
            }
        );
    },

    setFieldValues:function(values){
        $("#street")[0].value=values.street;
        $("#housenumber")[0].value=values.housenumber;
        $("#county")[0].value=values.county;
        $("#state")[0].value=values.state;
    },

    getFieldValues:function(fn){
        let street=$("#street")[0].value;
        let housenumber=$("#housenumber")[0].value;
        let county=$("#county")[0].value;
        let state=$("#state")[0].value;
        let isEmpty=(s)=>{return s==''};
        if( isEmpty(street) || isEmpty(housenumber) || isEmpty(county) || isEmpty(state) ){
            $('#op-notes').html("Complete o formulário!");
        }else{
            $('#op-notes').html("");
            fn({street:street,housenumber:housenumber,county:county,state:state});
        }

    },

    geoLocation:function(){
        controlForm.getFieldValues((values)=>{
            values["id"]=controlForm.userdata.address.id;// for update if is the case
            controlForm.userdata.address=values;
            /** values={id:id,street:street,housenumber:housenumber,county:county,state:state} */
            geo.getLocation(values, (location)=>{
                mainMap.addMarker(location,values);
                controlForm.enableSaveBtn();
            });
        });
    },

    saveAddress:function(){
        let ll=mainMap.getMarkerLocation(),
        qs="?userId="+controlForm.userdata.user.id+
            "&street="+controlForm.userdata.address.street+
            "&number="+controlForm.userdata.address.housenumber+
            "&county="+controlForm.userdata.address.county+
            "&state="+controlForm.userdata.address.state+
            "&longitude="+ll.lng+
            "&latitude="+ll.lat;
        let isAdd=true;
        if(controlForm.userdata.address.id){// update
            isAdd=false;
            qs=qs+"&addressId="+controlForm.userdata.address.id;
        }
        address.saveAddress(qs, isAdd, (res)=>{
            let msg="Endereço armazenado com sucesso.";
            if(!res) msg="Falhou ao armazenar o endereço.";
            controlForm.displayGeneralMessage(msg);
        });
    },

    registerEvents:function(){
        $('#geocode-btn').on('click', function (ev) {
            controlForm.geoLocation();
        });
        $('#save-btn').on('click', function (ev) {
            controlForm.saveAddress();
        });
    },

    enableGeoBtn:function(){
        $('#geocode-btn').attr('style','display:inline-block;');
    },

    enableSaveBtn:function(){
        $('#save-btn').attr('style','display:inline-block;');
    },

    displayGeneralMessage:function(msg){
        // setTimeout(
        //     ()=>{
        //         $('#general-info').attr('style','display:none;');
        //     },3000
        // )
        // $('#general-info').attr('style','display:inline-flex;');
        $('#general-notes').html(msg);
    }
};

