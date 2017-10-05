var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var medianIncome = {
    Area_Name: { type: String },
    Median_Income_2017: { type: Number },
    Person_1: { type: Number },
    People_2: { type: Number },
    People_3: { type: Number },
    People_4: { type: Number },
    People_5: { type: Number },
    People_6: { type: Number },
    People_7: { type: Number },
    People_8: { type: Number }
}

var medianIncomeSchema = mongoose.Schema(medianIncome);

mongoose.model("mdnincmprofiles", medianIncomeSchema);