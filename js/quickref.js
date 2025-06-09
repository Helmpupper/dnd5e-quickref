// Dynamically load the correct data files (2024 or standard) based on localStorage setting
(function() {
    var rules2024 = localStorage.getItem('rules2024') === 'true';
    var head = document.getElementsByTagName('head')[0];

    // Helper to inject a script tag for a data file
    function loadScript(src) {
        var script = document.createElement('script');
        script.src = src;
        script.defer = false;
        head.appendChild(script);
    }

    // Load either the 2024 or standard data file for a given base name
    function loadRuleFile(base) {
        if (rules2024) {
            loadScript('js/2024_' + base + '.js');
        } else {
            loadScript('js/' + base + '.js');
        }
    }

    // List of all rule data files to load
    var ruleFiles = [
        'data_movement',
        'data_action',
        'data_bonusaction',
        'data_reaction',
        'data_condition',
        'data_environment',
    ];

    ruleFiles.forEach(loadRuleFile);
})();

// Create and append a quick reference item to a section
// Sets up modal open logic for the item
function add_quickref_item(parent, data, type) {
    var icon = data.icon || "perspective-dice-six-faces-one";
    var subtitle = data.subtitle || "";
    var title = data.title || "[no title]";
    var optional = data.optional || "Standard rule";
    var item = document.createElement("div");
    item.className = "item itemsize";

    var itemIcon = document.createElement("div");
    itemIcon.className = "item-icon iconsize icon-" + icon;
    item.appendChild(itemIcon);

    var itemTextContainer = document.createElement("div");
    itemTextContainer.className = "item-text-container text";

    var itemTitle = document.createElement("div");
    itemTitle.className = "item-title";
    itemTitle.textContent = title;
    itemTextContainer.appendChild(itemTitle);

    var itemDesc = document.createElement("div");
    itemDesc.className = "item-desc";
    itemDesc.textContent = subtitle;
    itemTextContainer.appendChild(itemDesc);

    item.appendChild(itemTextContainer);

    // When the item is clicked, show the modal with the item's data
    item.onclick = function () {
        var section = parent.parentNode.parentNode;
        var style = window.getComputedStyle(section);
        var color = style.backgroundColor;
        var borderColor = style.borderColor;
        var darkMode = document.body.classList.contains('dark-mode-active') || document.querySelector('.dark-mode')?.classList.contains('dark-mode-active');
        var sectionTitle = section.querySelector('.section-title');
        var titleColor = sectionTitle ? window.getComputedStyle(sectionTitle).color : style.color;
        show_modal(data, color, type, titleColor, borderColor, darkMode);
    }
    item.setAttribute("title", optional);
    parent.appendChild(item);
}

// Show the modal dialog for a quickref item
function show_modal(data, color, type, titleColor, borderColor, darkMode) {
    var title = data.title || "[no title]";
    var subtitle = data.description || data.subtitle || "";
    var bullets = data.bullets || [];
    var reference = data.reference || "";
    type = type || "";

    document.body.classList.add("modal-open");

    var modal = document.getElementById("modal");
    var modalBackdrop = document.getElementById("modal-backdrop");
    var modalContainer = document.getElementById("modal-container");
    var modalTitle = document.getElementById("modal-title");
    var modalSubtitle = document.getElementById("modal-subtitle");
    var modalReference = document.getElementById("modal-reference");
    var modalBullets = document.getElementById("modal-bullets");

    modal.classList.add("modal-visible");
    modalBackdrop.style.height = window.innerHeight + "px";

    // Set modal colors to match section
    modalContainer.style.backgroundColor = color;
    modalContainer.style.borderColor = borderColor || color;
    modalTitle.style.color = titleColor || '';

    modalTitle.innerHTML = title + "<span class=\"float-right\">" + type + "</span>";
    modalSubtitle.textContent = subtitle;
    modalReference.textContent = reference;

    var bulletsHTML = bullets.map(function (item) {
        return "<p class=\"fonstsize\">" + item + "</p>";
    }).join("\n<hr>\n");

    modalBullets.innerHTML = bulletsHTML;
}

// Hide the modal if the user clicks outside the modal container
function hide_modal(event) {
    var modalContainer = document.getElementById("modal-container");
    if (!modalContainer.contains(event.target)) {
        document.body.classList.remove("modal-open");
        document.getElementById("modal").classList.remove("modal-visible");
    }
}

// Add click event to modal for hiding
var modal = document.getElementById("modal");
modal.addEventListener("click", hide_modal);

// Fill a section with quickref items from a data array
function fill_section(data, parentname, type) {
    var parent = document.getElementById(parentname);
    data.forEach(function (item) {
        add_quickref_item(parent, item, type);
    });
}

// Initialize all quickref sections and apply initial filtering
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
    // Apply initial filtering after items are created
    if (typeof window.handleRulesToggle === 'function') {
        window.handleRulesToggle();
    }
}

// Wait for all data scripts to be loaded before initializing and filtering
window.onload = function() {
    function waitForDataAndInit() {
        // Check if all required data variables are defined
        if (
            typeof data_movement !== 'undefined' &&
            typeof data_action !== 'undefined' &&
            typeof data_bonusaction !== 'undefined' &&
            typeof data_reaction !== 'undefined' &&
            typeof data_condition !== 'undefined' &&
            typeof data_environment_obscurance !== 'undefined' &&
            typeof data_environment_light !== 'undefined' &&
            typeof data_environment_vision !== 'undefined' &&
            typeof data_environment_cover !== 'undefined'
        ) {
            init();
        } else {
            // Try again in 50ms
            setTimeout(waitForDataAndInit, 50);
        }
    }
    waitForDataAndInit();
}

// DOMContentLoaded: Set up settings toggles, state, and filtering logic
// This block runs as soon as the DOM is ready
// Handles all settings toggles and their event listeners
// Also defines the filtering logic for quickref items

document.addEventListener("DOMContentLoaded", function () {
    // Ensure default values for toggles in localStorage
    if (localStorage.getItem('optional') === null) {
        localStorage.setItem('optional', 'false');
    }
    if (localStorage.getItem('homebrew') === null) {
        localStorage.setItem('homebrew', 'false');
    }

    // Get references to all settings checkboxes
    var optionalCheckbox = document.getElementById('optional-switch');
    var homebrewCheckbox = document.getElementById('homebrew-switch');
    var darkModeCheckbox = document.getElementById('darkmode-switch');
    var rules2024Checkbox = document.getElementById('rules2024-switch');

    // Set initial toggle state from localStorage
    var rules2024 = localStorage.getItem('rules2024') === 'true';
    rules2024Checkbox.checked = rules2024;

    var darkmode = localStorage.getItem('darkmode') === 'true';
    darkModeCheckbox.checked = darkmode;

    var optional = localStorage.getItem('optional') === 'true';
    optionalCheckbox.checked = optional;

    var homebrew = localStorage.getItem('homebrew') === 'true';
    homebrewCheckbox.checked = homebrew;

    // Apply dark mode state on load
    handleDarkModeToggle();

    // Filtering logic for quickref items based on toggles
    function handleRulesToggle() {
        var items = document.getElementsByClassName('item itemsize');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var ruleType = item.getAttribute('title');
            // Only filter items that are actual quickref rules
            if (ruleType === 'Optional rule' || ruleType === 'Homebrew rule' || ruleType === 'Standard rule') {
                var isOptional = ruleType === 'Optional rule';
                var isHomebrew = ruleType === 'Homebrew rule';
                // Show item if:
                // - It's an optional rule and the optional toggle is ON
                // - It's a homebrew rule and the homebrew toggle is ON
                // - It's a standard rule (always show)
                if ((isOptional && optionalCheckbox.checked) ||
                    (isHomebrew && homebrewCheckbox.checked) ||
                    (!isOptional && !isHomebrew)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            } else {
                // Always show settings toggles and other non-rule items
                item.style.display = 'block';
            }
        }
    }
    // Expose filtering function globally so init() can call it
    window.handleRulesToggle = handleRulesToggle;

    // Event listeners for toggles: update localStorage and re-filter on change
    optionalCheckbox.addEventListener('change', function() {
        localStorage.setItem('optional', optionalCheckbox.checked ? 'true' : 'false');
        handleRulesToggle();
    });
    homebrewCheckbox.addEventListener('change', function() {
        localStorage.setItem('homebrew', homebrewCheckbox.checked ? 'true' : 'false');
        handleRulesToggle();
    });
    darkModeCheckbox.addEventListener('change', function() {
        localStorage.setItem('darkmode', darkModeCheckbox.checked ? 'true' : 'false');
        handleDarkModeToggle();
    });
    rules2024Checkbox.addEventListener('change', handle2024RulesToggle);

    // Toggle dark mode classes on the page
    function handleDarkModeToggle() {
        const darkModeElements = document.querySelectorAll('.dark-mode, .page-background');
        darkModeElements.forEach(element => {
            if (darkModeCheckbox.checked) {
                element.classList.add('dark-mode-active');
            } else {
                element.classList.remove('dark-mode-active');
            }
        });
        localStorage.setItem('darkmode', darkModeCheckbox.checked ? 'true' : 'false');
    }

    // Handle switching between 2024 and standard rules
    function handle2024RulesToggle() {
        localStorage.setItem('rules2024', rules2024Checkbox.checked ? 'true' : 'false');
        location.reload();
    }

    // Set up click handlers for the settings toggle items (for better UX)
    var optionalToggleItem = document.getElementById('optional-toggle-item');
    var homebrewToggleItem = document.getElementById('homebrew-toggle-item');
    var darkModeToggleItem = document.getElementById('darkmode-toggle-item');
    var rules2024ToggleItem = document.getElementById('2024rules-toggle-item');

    function handleToggleClick(checkbox) {
        return function() {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        };
    }

    optionalToggleItem.addEventListener('click', handleToggleClick(optionalCheckbox));
    homebrewToggleItem.addEventListener('click', handleToggleClick(homebrewCheckbox));
    darkModeToggleItem.addEventListener('click', handleToggleClick(darkModeCheckbox));
    rules2024ToggleItem.addEventListener('click', handleToggleClick(rules2024Checkbox));
});