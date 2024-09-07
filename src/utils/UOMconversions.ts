export const UOMSetupConversion = (from: string, to: string, number:Number) => {
    let convertFrom = from?.toLocaleLowerCase() ?? "";
    let convertTo = to?.toLocaleLowerCase() ?? "";
    let value = 0;

    // values are in grams;
    let G = 1;
    let OUNCE = 28.34952 * G
    let POUND = 453.59237 * G;
    let KILOGRAM = 1000 * G;
    let TON = 1000 * KILOGRAM;
 
    if (convertFrom === convertTo) {
        return number;
    } else {
        switch (`${convertFrom}-${convertTo}`) {
            // MASS
            // grams conversion
            case "grams-kilogram":
                value = Number(number) / KILOGRAM;
                break;
            case "grams-ounce":
                value = Number(number) / OUNCE;
                break;
            case "grams-ton":
                value = Number(number) / TON;
                break;
            case "grams-pound":
                value = Number(number) / POUND;
                break;

            // kilogram conversion
            case "kilogram-grams":
                value = Number(number) * KILOGRAM;
                break;
            case "kilogram-ounce":
                value = Number(number) * (35.27396195);
                break;
            case "kilogram-ton":
                value = Number(number) / 1000;
                break;
            case "kilogram-pound":
                value = Number(number) / (0.45359237);
                break;


                value = Number(number) / 10;
                break;

            // ton conversion
            case "ton-grams":
                value = Number(number) * TON;
                break;
            case "ton-kilogram":
                value = Number(number) * 1000;
                break;
            case "ton-pound":
                value = Number(number) / (0.00045359237);
                break;
            case "ton-ounce":
                value = Number(number) * (32000);
                break;

            //pound conversion
            case "pound-grams":
                value = Number(number) * (453.59237);
                break;
            case "pound-kilogram":
                value = Number(number) * (0.45359237);
                break;
            case "pound-ton":
                value = Number(number) * (0.00045359237);
                break;
            case "pound-ounce":
                value = Number(number) * 16;
                break;

            // ounce conversion
            case "ounce-grams":
                value = Number(number) * OUNCE;
                break;
            case "ounce-kilogram":
                value = Number(number) / (35.27396195);
                break;
            case "ounce-ton":
                value = Number(number) / (0.00003125);
                break
            case "ounce-pound":
                value = Number(number) / 16;
                break;

            //CUSTOM
            //piece conversion
            case "piece-box":
                value = 1;
                break;
            case "box-piece":
                value = 1;
                break;

            //VOLUME
            case "millilitre-liter":
                value = Number(number) / 1000;
                break;
            case "millilitre-fluid_ounce":
                value = Number(number) * (0.033814);
                break;
            case "millilitre-gallon":
                value = Number(number) / (3785.41);
                break;

            case "liter-millilitre":
                value = Number(number) * 1000;
                break;
            case "liter-fluid_ounce":
                value = Number(number) * 33.814;
                break;
            case "liter-gallon":
                value = Number(number) * (0.264172);
                break;

            case "fluid_ounce-millilitre":
                value = Number(number) * (29.57353);
                break;
            case "fluid_ounce-liter":
                value = Number(number) * (0.029574);
                break;
            case "fluid_ounce-gallon":
                value = Number(number) / (128);
                break;

            case "gallon-millilitre":
                value = Number(number) * (3785.411784);
                break;
            case "gallon-liter":
                value = Number(number) * (3.785412);
                break;
            case "gallon-fluid_ounce":
                value = Number(number) * (128);
                break;

            //LENGTH
            case "inch-foot":
                value = Number(number) / (12);
                break;
            case "inch-meter":
                value = Number(number) * (0.0254);
                break;
            case "foot-inch":
                value = Number(number) * (12);
                break;
            case "foot-meter":
                value = Number(number) * (0.3048);
                break;
            case "meter-inch":
                value = Number(number) / (0.0254);
                break;
            case "meter-foot":
                value = Number(number) * (3.280839895);
                break;
        
        };
        return value
    }
}