export const initGridState = {
    url: "",
    busy: false,
    ready: false,
    page: 1,
    count: 0,
    limit: 25,
    sortcol: "",
    sortdir: "asc",
    search: "",
    inactive: false,
    parentname: "",
    parentid: "",
    rowEdit: { editor: false, record: {} },
    reset: false,
    data: [],
    selected: []
}

export const initFormState = (id) => ({
    id: id,
    url: "",
    verb: "",
    data: "",
    busy: false,
    reset: false
});

export const statesArray = [
    { value: "AL", text: "Alabama (AL)", default: true },
    { value: "AK", text: "Alaska (AK)", default: false },
    { value: "AZ", text: "Arizona (AZ)", default: false },
    { value: "AR", text: "Arkansas (AR)", default: false },
    { value: "CA", text: "California (CA)", default: false },
    { value: "CO", text: "Colorado (CO)", default: false },
    { value: "CT", text: "Connecticut (CT)", default: false },
    { value: "DE", text: "Delaware (DE)", default: false },
    { value: "FL", text: "Florida (FL)", default: false },
    { value: "GA", text: "Georgia (GA)", default: false },
    { value: "HI", text: "Hawaii (HI)", default: false },
    { value: "ID", text: "Idaho (ID)", default: false },
    { value: "IL", text: "Illinois (IL)", default: false },
    { value: "IN", text: "Indiana (IN)", default: false },
    { value: "IA", text: "Iowa (IA)", default: false },
    { value: "KS", text: "Kansas (KS)", default: false },
    { value: "KY", text: "Kentucky (KY)", default: false },
    { value: "LA", text: "Louisiana (LA)", default: false },
    { value: "ME", text: "Maine (ME)", default: false },
    { value: "MD", text: "Maryland (MD)", default: false },
    { value: "MA", text: "Massachusetts (MA)", default: false },
    { value: "MI", text: "Michigan (MI)", default: false },
    { value: "MN", text: "Minnesota (MN)", default: false },
    { value: "MS", text: "Mississippi (MS)", default: false },
    { value: "MO", text: "Missouri (MO)", default: false },
    { value: "MT", text: "Montana (MT)", default: false },
    { value: "NE", text: "Nebraska (NE)", default: false },
    { value: "NV", text: "Nevada (NV)", default: false },
    { value: "NH", text: "New Hampshire (NH)", default: false },
    { value: "NJ", text: "New Jersey (NJ)", default: false },
    { value: "NM", text: "New Mexico (NM)", default: false },
    { value: "NY", text: "New York (NY)", default: false },
    { value: "NC", text: "North Carolina (NC)", default: false },
    { value: "ND", text: "North Dakota (ND)", default: false },
    { value: "OH", text: "Ohio (OH)", default: false },
    { value: "OK", text: "Oklahoma (OK)", default: false },
    { value: "OR", text: "Oregon (OR)", default: false },
    { value: "PA", text: "Pennsylvania (PA)", default: false },
    { value: "RI", text: "Rhode Island (RI)", default: false },
    { value: "SC", text: "South Carolina (SC)", default: false },
    { value: "SD", text: "South Dakota (SD)", default: false },
    { value: "TN", text: "Tennessee (TN)", default: false },
    { value: "TX", text: "Texas (TX)", default: false },
    { value: "UT", text: "Utah (UT)", default: false },
    { value: "VT", text: "Vermont (VT)", default: false },
    { value: "VA", text: "Virginia (VA)", default: false },
    { value: "WA", text: "Washington (WA)", default: false },
    { value: "WV", text: "West Virginia (WV)", default: false },
    { value: "WI", text: "Wisconsin (WI)", default: false },
    { value: "WY", text: "Wyoming (WY)", default: false }
];

export const kbArticleTypes = [
    { value: "Accounts", text: "Accounts", default: true },
    { value: "Drivers", text: "Drivers", default: false },
    { value: "Law Enforcement", text: "Law Enforcement", default: false },
    { value: "Notifications", text: "Notifications", default: false },
    { value: "Reports", text: "Reports", default: false },
    { value: "Other", text: "Other", default: false }
]

export const entityTypes = [
    { value: "accounts", text: "Accounts", default: true },
    { value: "resellers", text: "Resellers", default: false },
    { value: "consultants", text: "Consultants", default: false },
]

export const timeZonesTypes = [
    { text: 'Eastern Time (US & Canada)', value: 'America/New_York', default: true },
    { text: 'Central Time (US & Canada)', value: 'America/Chicago', default: false },
    { text: 'Mountain Time (US & Canada)', value: 'America/Denver', default: false },
    { text: 'Pacific Time (US & Canada)', value: 'America/Los_Angeles', default: false },
    { text: 'Arizona', value: 'America/Phoenix', default: false },
    { text: 'Alaska', value: 'America/Anchorage', default: false },
    { text: 'Hawaii', value: 'Pacific/Honolulu', default: false },
    { text: 'London', value: 'Europe/London', default: false },
    { text: 'Paris', value: 'Europe/Paris', default: false },
    { text: 'Berlin', value: 'Europe/Berlin', default: false },
    { text: 'Rome', value: 'Europe/Rome', default: false },
    { text: 'Istanbul', value: 'Europe/Istanbul', default: false },
    { text: 'Tokyo', value: 'Asia/Tokyo', default: false },
    { text: 'Beijing', value: 'Asia/Shanghai', default: false },
    { text: 'Dubai', value: 'Asia/Dubai', default: false },
    { text: 'Mumbai', value: 'Asia/Kolkata', default: false },
    { text: 'Kolkata', value: 'Asia/Kolkata', default: false },
    { text: 'Bangkok', value: 'Asia/Bangkok', default: false },
    { text: 'Singapore', value: 'Asia/Singapore', default: false },
    { text: 'Sydney', value: 'Australia/Sydney', default: false },
    { text: 'Melbourne', value: 'Australia/Melbourne', default: false },
    { text: 'Brisbane', value: 'Australia/Brisbane', default: false },
    { text: 'Perth', value: 'Australia/Perth', default: false },
    { text: 'Cairo', value: 'Africa/Cairo', default: false },
    { text: 'Johannesburg', value: 'Africa/Johannesburg', default: false },
    { text: 'Mexico City', value: 'America/Mexico_City', default: false },
    { text: 'Toronto', value: 'America/Toronto', default: false },
    { text: 'Sao Paulo', value: 'America/Sao_Paulo', default: false },
    { text: 'Buenos Aires', value: 'America/Buenos_Aires', default: false },
    { text: 'Hong Kong', value: 'Asia/Hong_Kong', default: false },
    { text: 'Seoul', value: 'Asia/Seoul', default: false },
    { text: 'Jakarta', value: 'Asia/Jakarta', default: false },
    { text: 'Kuala Lumpur', value: 'Asia/Kuala_Lumpur', default: false }
]

export const userRankTypes = [
    { text: 'User', value: 'user', default: true },
    { text: 'Administrator', value: 'admin', default: false },
]

export const languageTypes = [
    { text: 'English', value: 'English', default: true },
    { text: 'Spanish', value: 'Spanish', default: false },

]

export const apiTypes = [
    { text: 'MVR', value: 'Motor Vehicle Report', default: true },
    { text: 'PSP', value: 'Pre-Employment Screening', default: false },
    { text: 'CDLIS', value: 'Commercial Drivers License', default: false },
    { text: 'BACK', value: 'Background Check', default: false },
]

export const domains = [
    { text: 'ourdqf.com', value: 'ourdqf.com', default: true },
    { text: 'driverfiles.com', value: 'driverfiles.com', default: false },
]

export const priceByType = [
    { value: "flat", text: "Flat Rate", default: true },
    { value: "driver", text: "Driver", default: false },
]

export const pricingFeeTypes = [
    { text: 'Account', value: 'accounts', default: true },
    { text: 'Reseller', value: 'resellers', default: false },
]

export const pricingFrequency = [
    { value: 'ondemand', text: 'On Demand', default: true },
    { value: 'monthly', text: 'Monthly', default: false },
]

export const yesNoTypes = [
    { value: "Y", text: "Yes", default: true },    
    { value: "N", text: "No", default: false },
]

export const yesNoNaTypes = [
    { value: "Y", text: "Yes", default: false },
    { value: "N", text: "No", default: false },
    { value: "A", text: "N/A", default: true },
]

export const bankAccountTypes = [
    { value: "bc", text: "Business Checking", default: true },
    { value: "pc", text: "Personal Checking", default: false },
    { value: "ps", text: "Savings", default: false },
]

export const transMethodTypes = [
    { value: "-1", text: "Withdrawal", default: true },
    { value: "1", text: "Deposit", default: false },
]
export const billingMethodTypes = [
    { value: "cc", text: "Credit / Debit Card", default: true },
    { value: "ach", text: "ACH E-Check", default: false },
]
export const billingDayTypes = [
    { value: 1, text: "1", default: true },
    { value: 2, text: "2", default: false },
    { value: 3, text: "3", default: false },
    { value: 4, text: "4", default: false },
    { value: 5, text: "5", default: false },
    { value: 6, text: "6", default: false },
    { value: 7, text: "7", default: false },
    { value: 8, text: "8", default: false },
    { value: 9, text: "9", default: false },
    { value: 10, text: "10", default: false },
    { value: 11, text: "11", default: false },
    { value: 12, text: "12", default: false },
    { value: 13, text: "13", default: false },
    { value: 14, text: "14", default: false },
    { value: 15, text: "15", default: false },
    { value: 16, text: "16", default: false },
    { value: 17, text: "17", default: false },
    { value: 18, text: "18", default: false },
    { value: 19, text: "19", default: false },
    { value: 20, text: "20", default: false },
    { value: 21, text: "21", default: false },
    { value: 22, text: "22", default: false },
    { value: 23, text: "23", default: false },
    { value: 24, text: "24", default: false },
    { value: 25, text: "25", default: false },
    { value: 26, text: "26", default: false },
    { value: 27, text: "27", default: false },
    { value: 28, text: "28", default: false }
]
export const monthTypes = [
    { value: "01", text: 'January', default: true },
    { value: "02", text: 'February', default: false },
    { value: "03", text: 'March', default: false },
    { value: "04", text: 'April', default: false },
    { value: "05", text: 'May', default: false },
    { value: "06", text: 'June', default: false },
    { value: "07", text: 'July', default: false },
    { value: "08", text: 'August', default: false },
    { value: "09", text: 'September', default: false },
    { value: "10", text: 'October', default: false },
    { value: "11", text: 'November', default: false },
    { value: "12", text: 'December', default: false }
];

export const yearTypes = () => {
    const currentYear = new Date().getFullYear();
    const futureYears = 15;
    const yearsArray = [];
    for (let i = 0; i <= futureYears; i++) {
        yearsArray.push({ value: (currentYear + i).toString(), text: (currentYear + i).toString(), default: i == 0 ? 1 : 0 });
    }    
    return yearsArray;
}

export const countryTypes = [
    { value: 'US', text: 'United States of America', default: true },
    { value: 'CA', text: 'Canada', default: false },
    { value: 'MX', text: 'Mexico', default: false },
    { value: 'AF', text: 'Afghanistan', default: false },
    { value: 'AX', text: 'Åland Islands', default: false },
    { value: 'AL', text: 'Albania', default: false },
    { value: 'DZ', text: 'Algeria', default: false },
    { value: 'AS', text: 'American Samoa', default: false },
    { value: 'AD', text: 'Andorra', default: false },
    { value: 'AO', text: 'Angola', default: false },
    { value: 'AI', text: 'Anguilla', default: false },
    { value: 'AQ', text: 'Antarctica', default: false },
    { value: 'AG', text: 'Antigua and Barbuda', default: false },
    { value: 'AR', text: 'Argentina', default: false },
    { value: 'AM', text: 'Armenia', default: false },
    { value: 'AW', text: 'Aruba', default: false },
    { value: 'AU', text: 'Australia', default: false },
    { value: 'AT', text: 'Austria', default: false },
    { value: 'AZ', text: 'Azerbaijan', default: false },
    { value: 'BS', text: 'Bahamas', default: false },
    { value: 'BH', text: 'Bahrain', default: false },
    { value: 'BD', text: 'Bangladesh', default: false },
    { value: 'BB', text: 'Barbados', default: false },
    { value: 'BY', text: 'Belarus', default: false },
    { value: 'BE', text: 'Belgium', default: false },
    { value: 'BZ', text: 'Belize', default: false },
    { value: 'BJ', text: 'Benin', default: false },
    { value: 'BM', text: 'Bermuda', default: false },
    { value: 'BT', text: 'Bhutan', default: false },
    { value: 'BO', text: 'Bolivia (Plurinational State of)', default: false },
    { value: 'BQ', text: 'Bonaire, Sint Eustatius and Saba', default: false },
    { value: 'BA', text: 'Bosnia and Herzegovina', default: false },
    { value: 'BW', text: 'Botswana', default: false },
    { value: 'BV', text: 'Bouvet Island', default: false },
    { value: 'BR', text: 'Brazil', default: false },
    { value: 'IO', text: 'British Indian Ocean Territory', default: false },
    { value: 'BN', text: 'Brunei Darussalam', default: false },
    { value: 'BG', text: 'Bulgaria', default: false },
    { value: 'BF', text: 'Burkina Faso', default: false },
    { value: 'BI', text: 'Burundi', default: false },
    { value: 'CV', text: 'Cabo Verde', default: false },
    { value: 'KH', text: 'Cambodia', default: false },
    { value: 'CM', text: 'Cameroon', default: false },    
    { value: 'KY', text: 'Cayman Islands', default: false },
    { value: 'CF', text: 'Central African Republic', default: false },
    { value: 'TD', text: 'Chad', default: false },
    { value: 'CL', text: 'Chile', default: false },
    { value: 'CN', text: 'China', default: false },
    { value: 'CX', text: 'Christmas Island', default: false },
    { value: 'CC', text: 'Cocos (Keeling) Islands', default: false },
    { value: 'CO', text: 'Colombia', default: false },
    { value: 'KM', text: 'Comoros', default: false },
    { value: 'CG', text: 'Congo', default: false },
    { value: 'CD', text: 'Congo (Democratic Republic of the)', default: false },
    { value: 'CK', text: 'Cook Islands', default: false },
    { value: 'CR', text: 'Costa Rica', default: false },
    { value: 'HR', text: 'Croatia', default: false },
    { value: 'CU', text: 'Cuba', default: false },
    { value: 'CW', text: 'Curaçao', default: false },
    { value: 'CY', text: 'Cyprus', default: false },
    { value: 'CZ', text: 'Czech Republic', default: false },
    { value: 'DK', text: 'Denmark', default: false },
    { value: 'DJ', text: 'Djibouti', default: false },
    { value: 'DM', text: 'Dominica', default: false },
    { value: 'DO', text: 'Dominican Republic', default: false },
    { value: 'EC', text: 'Ecuador', default: false },
    { value: 'EG', text: 'Egypt', default: false },
    { value: 'SV', text: 'El Salvador', default: false },
    { value: 'GQ', text: 'Equatorial Guinea', default: false },
    { value: 'ER', text: 'Eritrea', default: false },
    { value: 'EE', text: 'Estonia', default: false },
    { value: 'ET', text: 'Ethiopia', default: false },
    { value: 'FK', text: 'Falkland Islands (Malvinas)', default: false },
    { value: 'FO', text: 'Faroe Islands', default: false },
    { value: 'FJ', text: 'Fiji', default: false },
    { value: 'FI', text: 'Finland', default: false },
    { value: 'FR', text: 'France', default: false },
    { value: 'GF', text: 'French Guiana', default: false },
    { value: 'PF', text: 'French Polynesia', default: false },
    { value: 'TF', text: 'French Southern Territories', default: false },
    { value: 'GA', text: 'Gabon', default: false },
    { value: 'GM', text: 'Gambia', default: false },
    { value: 'GE', text: 'Georgia', default: false },
    { value: 'DE', text: 'Germany', default: false },
    { value: 'GH', text: 'Ghana', default: false },
    { value: 'GI', text: 'Gibraltar', default: false },
    { value: 'GR', text: 'Greece', default: false },
    { value: 'GL', text: 'Greenland', default: false },
    { value: 'GD', text: 'Grenada', default: false },
    { value: 'GP', text: 'Guadeloupe', default: false },
    { value: 'GU', text: 'Guam', default: false },
    { value: 'GT', text: 'Guatemala', default: false },
    { value: 'GG', text: 'Guernsey', default: false },
    { value: 'GN', text: 'Guinea', default: false },
    { value: 'GW', text: 'Guinea-Bissau', default: false },
    { value: 'GY', text: 'Guyana', default: false },
    { value: 'HT', text: 'Haiti', default: false },
    { value: 'HM', text: 'Heard Island and McDonald Islands', default: false },
    { value: 'VA', text: 'Holy See', default: false },
    { value: 'HN', text: 'Honduras', default: false },
    { value: 'HK', text: 'Hong Kong', default: false },
    { value: 'HU', text: 'Hungary', default: false },
    { value: 'IS', text: 'Iceland', default: false },
    { value: 'IN', text: 'India', default: false },
    { value: 'ID', text: 'Indonesia', default: false },
    { value: 'IR', text: 'Iran (Islamic Republic of)', default: false },
    { value: 'IQ', text: 'Iraq', default: false },
    { value: 'IE', text: 'Ireland', default: false },
    { value: 'IM', text: 'Isle of Man', default: false },
    { value: 'IL', text: 'Israel', default: false },
    { value: 'IT', text: 'Italy', default: false },
    { value: 'JM', text: 'Jamaica', default: false },
    { value: 'JP', text: 'Japan', default: false },
    { value: 'JE', text: 'Jersey', default: false },
    { value: 'JO', text: 'Jordan', default: false },
    { value: 'KZ', text: 'Kazakhstan', default: false },
    { value: 'KE', text: 'Kenya', default: false },
    { value: 'KI', text: 'Kiribati', default: false },
    { value: 'KP', text: "Korea (Democratic People's Republic of)", default: false },
    { value: 'KR', text: 'Korea (Republic of)', default: false },
    { value: 'KW', text: 'Kuwait', default: false },
    { value: 'KG', text: 'Kyrgyzstan', default: false },
    { value: 'LA', text: "Lao People's Democratic Republic", default: false },
    { value: 'LV', text: 'Latvia', default: false },
    { value: 'LB', text: 'Lebanon', default: false },
    { value: 'LS', text: 'Lesotho', default: false },
    { value: 'LR', text: 'Liberia', default: false },
    { value: 'LY', text: 'Libya', default: false },
    { value: 'LI', text: 'Liechtenstein', default: false },
    { value: 'LT', text: 'Lithuania', default: false },
    { value: 'LU', text: 'Luxembourg', default: false },
    { value: 'MO', text: 'Macao', default: false },
    { value: 'MK', text: 'Macedonia (the former Yugoslav Republic of)', default: false },
    { value: 'MG', text: 'Madagascar', default: false },
    { value: 'MW', text: 'Malawi', default: false },
    { value: 'MY', text: 'Malaysia', default: false },
    { value: 'MV', text: 'Maldives', default: false },
    { value: 'ML', text: 'Mali', default: false },
    { value: 'MT', text: 'Malta', default: false },
    { value: 'MH', text: 'Marshall Islands', default: false },
    { value: 'MQ', text: 'Martinique', default: false },
    { value: 'MR', text: 'Mauritania', default: false },
    { value: 'MU', text: 'Mauritius', default: false },
    { value: 'YT', text: 'Mayotte', default: false },    
    { value: 'FM', text: 'Micronesia (Federated States of)', default: false },
    { value: 'MD', text: 'Moldova (Republic of)', default: false },
    { value: 'MC', text: 'Monaco', default: false },
    { value: 'MN', text: 'Mongolia', default: false },
    { value: 'ME', text: 'Montenegro', default: false },
    { value: 'MS', text: 'Montserrat', default: false },
    { value: 'MA', text: 'Morocco', default: false },
    { value: 'MZ', text: 'Mozambique', default: false },
    { value: 'MM', text: 'Myanmar', default: false },
    { value: 'NA', text: 'Namibia', default: false },
    { value: 'NR', text: 'Nauru', default: false },
    { value: 'NP', text: 'Nepal', default: false },
    { value: 'NL', text: 'Netherlands', default: false },
    { value: 'NC', text: 'New Caledonia', default: false },
    { value: 'NZ', text: 'New Zealand', default: false },
    { value: 'NI', text: 'Nicaragua', default: false },
    { value: 'NE', text: 'Niger', default: false },
    { value: 'NG', text: 'Nigeria', default: false },
    { value: 'NU', text: 'Niue', default: false },
    { value: 'NF', text: 'Norfolk Island', default: false },
    { value: 'MP', text: 'Northern Mariana Islands', default: false },
    { value: 'NO', text: 'Norway', default: false },
    { value: 'OM', text: 'Oman', default: false },
    { value: 'PK', text: 'Pakistan', default: false },
    { value: 'PW', text: 'Palau', default: false },
    { value: 'PS', text: 'Palestine, State of', default: false },
    { value: 'PA', text: 'Panama', default: false },
    { value: 'PG', text: 'Papua New Guinea', default: false },
    { value: 'PY', text: 'Paraguay', default: false },
    { value: 'PE', text: 'Peru', default: false },
    { value: 'PH', text: 'Philippines', default: false },
    { value: 'PN', text: 'Pitcairn', default: false },
    { value: 'PL', text: 'Poland', default: false },
    { value: 'PT', text: 'Portugal', default: false },
    { value: 'PR', text: 'Puerto Rico', default: false },
    { value: 'QA', text: 'Qatar', default: false },
    { value: 'RE', text: 'Réunion', default: false },
    { value: 'RO', text: 'Romania', default: false },
    { value: 'RU', text: 'Russian Federation', default: false },
    { value: 'RW', text: 'Rwanda', default: false },
    { value: 'BL', text: 'Saint Barthélemy', default: false },
    { value: 'SH', text: 'Saint Helena, Ascension and Tristan da Cunha', default: false },
    { value: 'KN', text: 'Saint Kitts and Nevis', default: false },
    { value: 'LC', text: 'Saint Lucia', default: false },
    { value: 'MF', text: 'Saint Martin (French part)', default: false },
    { value: 'PM', text: 'Saint Pierre and Miquelon', default: false },
    { value: 'VC', text: 'Saint Vincent and the Grenadines', default: false },
    { value: 'WS', text: 'Samoa', default: false },
    { value: 'SM', text: 'San Marino', default: false },
    { value: 'ST', text: 'Sao Tome and Principe', default: false },
    { value: 'SA', text: 'Saudi Arabia', default: false },
    { value: 'SN', text: 'Senegal', default: false },
    { value: 'RS', text: 'Serbia', default: false },
    { value: 'SC', text: 'Seychelles', default: false },
    { value: 'SL', text: 'Sierra Leone', default: false },
    { value: 'SG', text: 'Singapore', default: false },
    { value: 'SX', text: 'Sint Maarten (Dutch part)', default: false },
    { value: 'SK', text: 'Slovakia', default: false },
    { value: 'SI', text: 'Slovenia', default: false },
    { value: 'SB', text: 'Solomon Islands', default: false },
    { value: 'SO', text: 'Somalia', default: false },
    { value: 'ZA', text: 'South Africa', default: false },
    { value: 'GS', text: 'South Georgia and the South Sandwich Islands', default: false },
    { value: 'SS', text: 'South Sudan', default: false },
    { value: 'ES', text: 'Spain', default: false },
    { value: 'LK', text: 'Sri Lanka', default: false },
    { value: 'SD', text: 'Sudan', default: false },
    { value: 'SR', text: 'Suriname', default: false },
    { value: 'SJ', text: 'Svalbard and Jan Mayen', default: false },
    { value: 'SZ', text: 'Swaziland', default: false },
    { value: 'SE', text: 'Sweden', default: false },
    { value: 'CH', text: 'Switzerland', default: false },
    { value: 'SY', text: 'Syrian Arab Republic', default: false },
    { value: 'TW', text: 'Taiwan, Province of China[a]', default: false },
    { value: 'TJ', text: 'Tajikistan', default: false },
    { value: 'TZ', text: 'Tanzania, United Republic of', default: false },
    { value: 'TH', text: 'Thailand', default: false },
    { value: 'TL', text: 'Timor-Leste', default: false },
    { value: 'TG', text: 'Togo', default: false },
    { value: 'TK', text: 'Tokelau', default: false },
    { value: 'TO', text: 'Tonga', default: false },
    { value: 'TT', text: 'Trinidad and Tobago', default: false },
    { value: 'TN', text: 'Tunisia', default: false },
    { value: 'TR', text: 'Turkey', default: false },
    { value: 'TM', text: 'Turkmenistan', default: false },
    { value: 'TC', text: 'Turks and Caicos Islands', default: false },
    { value: 'TV', text: 'Tuvalu', default: false },
    { value: 'UG', text: 'Uganda', default: false },
    { value: 'UA', text: 'Ukraine', default: false },
    { value: 'AE', text: 'United Arab Emirates', default: false },
    { value: 'GB', text: 'United Kingdom of Great Britain and Northern Ireland', default: false },
    { value: 'UM', text: 'United States Minor Outlying Islands', default: false },    
    { value: 'UY', text: 'Uruguay', default: false },
    { value: 'UZ', text: 'Uzbekistan', default: false },
    { value: 'VU', text: 'Vanuatu', default: false },
    { value: 'VE', text: 'Venezuela (Bolivarian Republic of)', default: false },
    { value: 'VN', text: 'Viet Nam', default: false },
    { value: 'VG', text: 'Virgin Islands (British)', default: false },
    { value: 'VI', text: 'Virgin Islands (U.S.)', default: false },
    { value: 'WF', text: 'Wallis and Futuna', default: false },
    { value: 'EH', text: 'Western Sahara', default: false },
    { value: 'YE', text: 'Yemen', default: false },
    { value: 'ZM', text: 'Zambia', default: false },
    { value: 'ZW', text: 'Zimbabwe', default: false }
]

export const dlClassTypes = [
    {value:"a",text:"United States - Class A",default:true},
    {value:"b",text:"United States - Class B",default:false},
    {value:"c",text:"United States - Class C",default:false},
    {value:"n",text:"United States - Non-CDL",default:false},
    {value:"ab-1",text:"Alberta - Class 1",default:false},
    {value:"ab-2",text:"Alberta - Class 2",default:false},
    {value:"ab-3",text:"Alberta - Class 3",default:false},
    {value:"ab-4",text:"Alberta - Class 4",default:false},
    {value:"ab-n",text:"Alberta - Non-CDL",default:false},
    {value:"bc-1",text:"British Columbia - Class 1",default:false},
    {value:"bc-2",text:"British Columbia - Class 2",default:false},
    {value:"bc-3",text:"British Columbia - Class 3",default:false},
    {value:"bc-4u",text:"British Columbia - Class 4 Unrestricted",default:false},
    {value:"bc-4r",text:"British Columbia - Class 4 Restricted",default:false},
    {value:"bc-n",text:"British Columbia - Non-CDL",default:false},
    {value:"mb-1",text:"Manitoba - Class 1",default:false},
    {value:"mb-2",text:"Manitoba - Class 2",default:false},
    {value:"mb-3",text:"Manitoba - Class 3",default:false},
    {value:"mb-4",text:"Manitoba - Class 4",default:false},
    {value:"mb-n",text:"Manitoba - Non-CDL",default:false},
    {value:"nb-1",text:"New Brunswick - Class 1",default:false},
    {value:"nb-2",text:"New Brunswick - Class 2",default:false},
    {value:"nb-3",text:"New Brunswick - Class 3",default:false},
    {value:"nb-3-4",text:"New Brunswick - Class 3 &amp; 4",default:false},
    {value:"nb-4",text:"New Brunswick - Class 4",default:false},
    {value:"nb-5",text:"New Brunswick - Class 5",default:false},
    {value:"nb-n",text:"New Brunswick - Non-CDL",default:false},
    {value:"nl-1",text:"Newfoundland Labrador - Class 1",default:false},
    {value:"nl-2",text:"Newfoundland Labrador - Class 2",default:false},
    {value:"nl-3",text:"Newfoundland Labrador - Class 3",default:false},
    {value:"nl-4",text:"Newfoundland Labrador - Class 4",default:false},
    {value:"nl-n",text:"Newfoundland Labrador - Non-CDL",default:false},
    {value:"nt-1",text:"Northwest Territories - Class 1",default:false},
    {value:"nt-2",text:"Northwest Territories - Class 2",default:false},
    {value:"nt-3",text:"Northwest Territories - Class 3",default:false},
    {value:"nt-4",text:"Northwest Territories - Class 4",default:false},
    {value:"nt-n",text:"Northwest Territories - Non-CDL",default:false},
    {value:"ns-1",text:"Nova Scotia - Class 1",default:false},
    {value:"ns-2",text:"Nova Scotia - Class 2",default:false},
    {value:"ns-3",text:"Nova Scotia - Class 3",default:false},
    {value:"ns-4",text:"Nova Scotia - Class 4",default:false},
    {value:"ns-n",text:"Nova Scotia - Non-CDL",default:false},
    {value:"nu-1",text:"Nunavut - Class 1",default:false},
    {value:"nu-2",text:"Nunavut - Class 2",default:false},
    {value:"nu-3",text:"Nunavut - Class 3",default:false},
    {value:"nu-4",text:"Nunavut - Class 4",default:false},
    {value:"nu-n",text:"Nunavut - Non-CDL",default:false},
    {value:"on-a",text:"Ontario - Class A",default:false},
    {value:"on-b",text:"Ontario - Class B",default:false},
    {value:"on-c",text:"Ontario - Class C",default:false},
    {value:"on-d",text:"Ontario - Class D",default:false},
    {value:"on-e",text:"Ontario - Class E",default:false},
    {value:"on-f",text:"Ontario - Class F",default:false},
    {value:"on-n",text:"Ontario - Non-CDL",default:false},
    {value:"pe-1",text:"Prince Edward Island - Class 1",default:false},
    {value:"pe-2",text:"Prince Edward Island - Class 2",default:false},
    {value:"pe-3",text:"Prince Edward Island - Class 3",default:false},
    {value:"pe-4",text:"Prince Edward Island - Class 4",default:false},
    {value:"pe-n",text:"Prince Edward Island - Non-CDL",default:false},
    {value:"qc-1",text:"Quebec - Class 1",default:false},
    {value:"qc-2",text:"Quebec - Class 2",default:false},
    {value:"qc-3",text:"Quebec - Class 3",default:false},
    {value:"qc-4a",text:"Quebec - Class 4A",default:false},
    {value:"qc-4b",text:"Quebec - Class 4B",default:false},
    {value:"qc-4c",text:"Quebec - Class 4C",default:false},
    {value:"qc-n",text:"Quebec - Non-CDL",default:false},
    {value:"sk-1",text:"Saskatchewan - Class 1",default:false},
    {value:"sk-2",text:"Saskatchewan - Class 2",default:false},
    {value:"sk-3",text:"Saskatchewan - Class 3",default:false},
    {value:"sk-4",text:"Saskatchewan - Class 4",default:false},
    {value:"sk-n",text:"Saskatchewan - Non-CDL",default:false},
    {value:"yt-1",text:"Yukon - Class 1",default:false},
    {value:"yt-2",text:"Yukon - Class 2",default:false},
    {value:"yt-3",text:"Yukon - Class 3",default:false},
    {value:"yt-4",text:"Yukon - Class 4",default:false},
    {value:"yt-n",text:"Yukon - Non-CDL",default:false},
    {value:"mx-b",text:"Mexico - Type B",default:false},
    {value:"mx-n",text:"Mexico - Non-CDL",default:false},
    {value:"other",text:"Other",default:false}    
]

export const noHireType = [
    {value:"Applicant is not a good fit for our company",text:"Applicant is not a good fit for our company",default:true},
    {value:"Applicant failed a pre-employment drug test",text:"Applicant failed a pre-employment drug test",default:false},    
    {value:"Items found on the background check",text:"Items found on the background check",default:false},    
    {value:"Items found on the Commercial Driver",text:"Items found on the Commercial Driver",default:false},    
    {value:"Items found on the Motor Vehicle Report (MVR)",text:"Items found on the Motor Vehicle Report (MVR)",default:false},    
    {value:"Items found on the Pre-Employment Screening Program (PSP) report",text:"Items found on the Pre-Employment Screening Program (PSP) report",default:false},    
    {value:"Other reason not listed above.",text:"Other reason not listed above.",default:false}    
]

export const driverTypes = [
    {value:"",text:"Select...",default:false},
    {value:"interstate",text:"Interstate",default:false},
    {value:"intrastate",text:"Intrastate",default:false},
    {value:"both",text:"Both",default:false},
]