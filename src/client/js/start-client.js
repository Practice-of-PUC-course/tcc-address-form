$(document).ready(function () {
    // conf is loading as global only for tests
    mainMap.init(conf);
    registerEvents();
    controlForm.initDisplays();
});

/**
 * API Results Handler and UI View
 */
var controlForm={

    initDisplays:function(){
        user.getUsers((users)=>{
            controlForm.displayUserList(users);
        });
    },

    displayUserList:function(users){
        let itens="";
        users.forEach((u)=>{
            itens+='<li><a class="dropdown-item" href="#">'+u.name+'</a></li>';
        });
        $("#useritens").html(itens);
    },

    getFieldValues:function(fn){
        let street=$("#street").value;
        let housenumber=$("#housenumber").value;
        let county=$("#county").value;
        let state=$("#state").value;
        let isEmpty=(s)=>{return s==''};
        if( isEmpty(street) || isEmpty(housenumber) || isEmpty(county) || isEmpty(state) ){
            $('#op-notes').html("Complete o formulário!");
        }else{
            $('#op-notes').html("");
            fn({street:street,housenumber:housenumber,county:county,state:state});
        }

    }
};

var registerEvents=()=>{
    $('#geocode-btn').on('click', function (ev) {
        controlForm.getFieldValues((values)=>{
            /** values={street:street,housenumber:housenumber,county:county,state:state} */
            geo.getLocation(values, (location)=>{
                mainMap.createMainLayer(location);
            });
        });
    });
};