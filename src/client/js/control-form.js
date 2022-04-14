
/**
 * API Results Handler and UI View
 */
 var controlForm={
    userdata:{
        userId:null
    },

    initDisplays:function(){
        user.getUsers((users)=>{
            controlForm.displayUserList(users);
        });
    },

    setUserId:function(id){
        controlForm.userdata.userId=id;
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

    registerEvents:function(){
        $('#geocode-btn').on('click', function (ev) {
            controlForm.getFieldValues((values)=>{
                /** values={street:street,housenumber:housenumber,county:county,state:state} */
                geo.getLocation(values, (location)=>{
                    mainMap.createMainLayer(location);
                });
            });
        });
    },

    displayGeneralMessage:function(msg){
        setTimeout(
            ()=>{
                $('#general-info').attr('style','display:none;');
            },3000
        )
        $('#general-info').attr('style','display:block;');
        $('#general-notes').html(msg);
    }
};

