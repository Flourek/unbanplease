import { finalize } from './script.js'

export function setupKeybinds() {
    $(document).ready(function() {
    $(document).keydown(function(event) {
        // Check if the Tab key (key code 9) is pressed
        if (event.keyCode === 9) {
            event.preventDefault(); // Prevent the default Tab action
            alert("buh")
            // Call one of the custom functions
            customFunctions.customFunction1(); // Call customFunction1
            // You can call other functions as needed
            // customFunctions.customFunction2(); // Call customFunction2
        }
    });
    });
}