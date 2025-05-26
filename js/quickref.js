function add_quickref_item(parent, data, type) {
    // Set default values for icon, subtitle, and title if not provided in the data object
    var icon = data.icon || "perspective-dice-six-faces-one";
    var subtitle = data.subtitle || "";
    var title = data.title || "[no title]";
    var optional = data.optional || "false"; // Get the optional property from the data object
    // Create a new 'div' element for the quick reference item
    var item = document.createElement("div");
    // Add classes to the item element
    item.className = "item itemsize";

    // Create the item-icon element
    var itemIcon = document.createElement("div");
    itemIcon.className = "item-icon iconsize icon-" + icon;
    item.appendChild(itemIcon);

    // Create the item-text-container element
    var itemTextContainer = document.createElement("div");
    itemTextContainer.className = "item-text-container text";

    // Create the item-title element
    var itemTitle = document.createElement("div");
    itemTitle.className = "item-title";
    itemTitle.textContent = title;
    itemTextContainer.appendChild(itemTitle);

    // Create the item-desc element
    var itemDesc = document.createElement("div");
    itemDesc.className = "item-desc";
    itemDesc.textContent = subtitle;
    itemTextContainer.appendChild(itemDesc);

    // Append the item-text-container to the item element
    item.appendChild(itemTextContainer);

    // Get the background color of the parent's parent's parent element
    var style = window.getComputedStyle(parent.parentNode.parentNode);
    var color = style.backgroundColor;

    // Attach a click event to the item, which triggers the show_modal function with data, color, and type parameters
    item.onclick = function () {
        show_modal(data, color, type);
    }
    // Set the title attribute of the item div to the value of the optional property
    item.setAttribute("title", optional);
    // Append the created item to the specified parent element
    parent.appendChild(item);
}

function show_modal(data, color, type) {
    var title = data.title || "[no title]";
    var subtitle = data.description || data.subtitle || "";
    var bullets = data.bullets || [];
    var reference = data.reference || "";
    type = type || "";
    color = color || "black";

    // Add a class to the body to simulate $("body").addClass("modal-open");
    document.body.classList.add("modal-open");

    // Get references to the modal and its elements using document.getElementById
    var modal = document.getElementById("modal");
    var modalBackdrop = document.getElementById("modal-backdrop");
    var modalContainer = document.getElementById("modal-container");
    var modalTitle = document.getElementById("modal-title");
    var modalSubtitle = document.getElementById("modal-subtitle");
    var modalReference = document.getElementById("modal-reference");
    var modalBullets = document.getElementById("modal-bullets");

    // Set styles and content using standard DOM properties
    modal.classList.add("modal-visible");
    modalBackdrop.style.height = window.innerHeight + "px";
    modalContainer.style.backgroundColor = color;
    modalContainer.style.borderColor = color;
    modalTitle.innerHTML = title + "<span class=\"float-right\">" + type + "</span>";
    modalSubtitle.textContent = subtitle;
    modalReference.textContent = reference;

    // Create HTML for bullets using map and join
    var bulletsHTML = bullets.map(function (item) {
        return "<p class=\"fonstsize\">" + item + "</p>";
    }).join("\n<hr>\n");

    // Set the innerHTML of modalBullets
    modalBullets.innerHTML = bulletsHTML;
}

function hide_modal(event) {
    var modalContainer = document.getElementById("modal-container");

    // Check if the clicked element is outside of the modal container
    if (!modalContainer.contains(event.target)) {
        document.body.classList.remove("modal-open");
        document.getElementById("modal").classList.remove("modal-visible");
    }
}

// Update the click event handling for the modal
var modal = document.getElementById("modal");
modal.addEventListener("click", hide_modal);

function fill_section(data, parentname, type) {
    var parent = document.getElementById(parentname);
    data.forEach(function (item) {
        add_quickref_item(parent, item, type);
    });
}

function init() {
    fill_section(data_movement, "basic-movement", "Move");
    fill_section(data_action, "basic-actions", "Action");
    fill_section(data_bonusaction, "basic-bonus-actions", "Bonus action");
    fill_section(data_reaction, "basic-reactions", "Reaction");
    fill_section(data_condition, "basic-conditions", "Condition");
    fill_section(data_environment_obscurance, "environment-obscurance", "Environment");
    fill_section(data_environment_light, "environment-light", "Environment");
    fill_section(data_environment_vision, "environment-vision", "Environment");
    fill_section(data_environment_cover, "environment-cover", "Environment");

    var modal = document.getElementById("modal");
    modal.addEventListener("click", hide_modal);
}

document.addEventListener("DOMContentLoaded", init);

//Settings Switches
document.addEventListener("DOMContentLoaded", function () {
    // Select the checkboxes
    var optionalCheckbox = document.getElementById('optional-switch');
    var homebrewCheckbox = document.getElementById('homebrew-switch');
    var darkModeCheckbox = document.getElementById('darkmode-switch');
    var rules2024Checkbox = document.getElementById('rules2024-switch');

    // Function to handle checkbox changes for optional and homebrew rules
    function handleRulesToggle() {
        console.log("Rules switches toggled"); // Debugging statement
        var items = document.getElementsByClassName('item itemsize');

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemType = item.getAttribute('title');
            var isOptional = itemType === 'Optional rule';
            var isHomebrew = itemType === 'Homebrew rule';

            if ((optionalCheckbox.checked && isOptional) ||
                (homebrewCheckbox.checked && isHomebrew) ||
                (!isOptional && !isHomebrew)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    }

    // Function to handle darkmode toggle
    function handleDarkModeToggle() {
        console.log("Dark mode switch toggled"); // Debugging statement
        const darkModeElements = document.querySelectorAll('.dark-mode, .page-background');
        darkModeElements.forEach(element => {
            if (darkModeCheckbox.checked) {
                element.classList.add('dark-mode-active');
            } else {
                element.classList.remove('dark-mode-active');
            }
        });
    }

    // Function to handle 2024 rules toggle
    function handle2024RulesToggle() {
        // Store the value in localStorage
        localStorage.setItem('rules2024', rules2024Checkbox.checked ? 'true' : 'false');
        // Reload the page to load the correct data files
        location.reload();
    }

    // Add event listeners to the checkboxes
    optionalCheckbox.addEventListener('change', handleRulesToggle);
    homebrewCheckbox.addEventListener('change', handleRulesToggle);
    darkModeCheckbox.addEventListener('change', handleDarkModeToggle);
    rules2024Checkbox.addEventListener('change', handle2024RulesToggle);

    // Call the functions to initially set the correct states
    handleRulesToggle();
    handleDarkModeToggle();

    // Get the toggle items
    var optionalToggleItem = document.getElementById('optional-toggle-item');
    var homebrewToggleItem = document.getElementById('homebrew-toggle-item');
    var darkModeToggleItem = document.getElementById('darkmode-toggle-item');
    var rules2024ToggleItem = document.getElementById('2024rules-toggle-item');

    // Function to handle click on the toggle items
    function handleToggleClick(checkbox) {
        return function() {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        };
    }

    // Add event listeners to the toggle items
    optionalToggleItem.addEventListener('click', handleToggleClick(optionalCheckbox));
    homebrewToggleItem.addEventListener('click', handleToggleClick(homebrewCheckbox));
    darkModeToggleItem.addEventListener('click', handleToggleClick(darkModeCheckbox));
    rules2024ToggleItem.addEventListener('click', handleToggleClick(rules2024Checkbox));

    // Ensure dark mode is off by default
    darkModeCheckbox.checked = false;
    handleDarkModeToggle();

    // Set 2024 rules toggle state from localStorage
    var rules2024 = localStorage.getItem('rules2024') === 'true';
    rules2024Checkbox.checked = rules2024;
});

// Dynamically load the correct data files based on the 2024 rules toggle
(function() {
    var rules2024 = localStorage.getItem('rules2024') === 'true';
    var head = document.getElementsByTagName('head')[0];

    function loadScript(src) {
        var script = document.createElement('script');
        script.src = src;
        script.defer = false;
        head.appendChild(script);
    }

    // Always load movement and other non-action files as usual
    loadScript('js/data_movement.js');
    loadScript('js/data_bonusaction.js');
    loadScript('js/data_reaction.js');
    loadScript('js/data_condition.js');
    loadScript('js/data_environment_obscurance.js');
    loadScript('js/data_environment_light.js');
    loadScript('js/data_environment_vision.js');
    loadScript('js/data_environment_cover.js');

    // Load the correct action file
    if (rules2024) {
        loadScript('js/2024_data_action.js');
    } else {
        loadScript('js/data_action.js');
    }
})();