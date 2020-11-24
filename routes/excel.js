const xlsxFile = require('read-excel-file/node');

exports.getData = async (path) => {
    const rows = await xlsxFile(path);
    const data = rows.slice(3, -1).map(row => parseColumn(row));
    return data;
}

const parseColumn = (row) => {
    const data = {
        personnelDetails: {
            reference_no: row[2],
            employer_id: row[4],
            contact_no: row[5],
            first_name: row[6],
            middle_name: row[7],
            last_name: row[8],
            father_name: row[9],
            dateofbirth: row[10],
            gender: row[11].toLowerCase(),
            marital_status: row[12],
            nationality: row[13],
            alternate_contact: row[14],
            email_id: row[15],
        },
        contactDetails: {
            permanent_address: row[16],
            pin_code: row[17],
            district: row[18],
            state: row[19],
            start_of_stay: row[20],
            end_of_stay: row[21],
            current_address: row[22],
            current_pin_code: row[23],
            current_district: row[24],
            current_state: row[25],
            current_start_of_stay: row[26],
            current_end_of_stay: row[27],
            previous_address: row[28],
            previous_pin_code: row[29],
            previous_district: row[30],
            previous_state: row[31],
            previous_start_of_stay: row[32],
            previous_end_of_stay: row[33],
            past_address: row[43],
            past_pin_code: row[44],
            past_district: row[45],
            past_state: row[46],
            past_start_of_stay: row[32],
            past_end_of_stay: row[33],
        },
        educationDetails: [{
            institute_name: row[34],
            location: row[35],
            roll_or_reg: row[36],
            course: row[37],
            course_begin_year: row[38],
            year_of_passing: row[39],
            class_or_percentage: row[40],
            university_board_name: row[41],
        }],
        employmentVerificationDetails: [{
            company_name: row[47],
            company_address: row[48],
            company_pin_code: row[49],
            company_district: row[50],
            company_state: row[51],
            company_salary: row[52],
            company_reason_for_leaving: row[53],
            company_designation: row[54],
            company_start_date: row[55],
            company_end_date: row[56],
            comapny_employee_id: row[57],
            company_supervisor_name: row[58],
            company_supervisor_email: row[60],
            company_supervisor_contact: row[59],
            company_hr_email: row[61],
        }],
        identityVerificationDetails: [{
            id_type: 'passport',
            id_number: row[67],
            date_of_issue: row[68],
            date_of_expiry: row[69],
            place_of_issue: row[70],
        }]
    }
    return data;
};