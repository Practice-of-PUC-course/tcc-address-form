$(document).ready(function () {
    // conf is loading as global only for tests
    mainMap.init(conf);
    controlForm.registerEvents();
    controlForm.initDisplays();
});