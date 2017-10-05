var Register = require('./Register/Register.controller')
var Project = require('./Projects/Project.controller')
var Admin = require('./Admin/Admin.controller')
module.exports = function (app) {
    //user routing
    app.post('/userRegister', Register.register)
    app.post('/userUpdate', Register.update)
    app.post('/userDelete', Register.delete1)
    app.post('/userActiveAccount', Register.ActiveAccount)
    app.post('/userLogin', Register.UserLogin)
    app.get('/findUsers', Register.findUsers)
    app.post('/fgtpswd', Register.fgtpswd)
    app.post('/changepswd', Register.changepswd)

    //project routing
    app.post('/createProject', Project.create)
    app.post('/ProjectUpdate', Project.update)
    app.post('/ProjectDelete', Project.delete)
    app.get('/findProjects', Project.findProjects)

    //Admin routing
    app.post('/AdminRegister', Admin.register)
    app.post('/AdminUpdate', Admin.update)
    app.post('/adminfgtpswd', Admin.adminfgtpswd)
    app.post('/adminchangepswd', Admin.adminchangepswd)

    //Median income
    app.get('/medianIncome', Admin.medianIncome)
    app.post('/addMedianIncome', Admin.addMedianIncomeData)
    app.post('/updateMedianIncome', Admin.updateMedianIncome)
    app.post('/deleteMedianIncome', Admin.deleteMedianIncome)

    // FMR Rents
    app.get('/fmrRents', Admin.fmrRents)
    app.post('/addfmrRents', Admin.addfmrRents)
    app.post('/updatefmrRents', Admin.updatefmrRents)
    app.post('/deletefmrRents', Admin.deletefmrRents)

    //RC Assumptions
    app.get('/rcAssumption', Admin.rcAssumption)
    app.post('/addRCAData', Admin.addRCAData)
    app.post('/updateRCAData', Admin.updateRCAData)
    app.post('/deleteRCAData', Admin.deleteRCAData)


}