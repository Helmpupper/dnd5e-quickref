// Loads the appropriate rule data files based on the 2024 rules toggle
(function() {
    var rules2024 = localStorage.getItem('rules2024') === 'true';
    var head = document.getElementsByTagName('head')[0];

    function loadScript(src) {
        var script = document.createElement('script');
        script.src = src;
        script.defer = false;
        head.appendChild(script);
    }

    function loadRuleFile(base) {
        if (rules2024) {
            loadScript('js/2024_' + base + '.js');
        } else {
            loadScript('js/' + base + '.js');
        }
    }

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

// Adds a quick reference item to the parent element and sets up modal open logic with section color
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

    // Set up click event to open the modal with section and title colors
    item.onclick = function () {
        // Always get the latest colors and dark mode state
        var section = parent.parentNode.parentNode;
        var style = window.getComputedStyle(section);
        var color = style.backgroundColor;
        var borderColor = style.borderColor;
        var darkMode = document.body.classList.contains('dark-mode-active') || document.querySelector('.dark-mode')?.classList.contains('dark-mode-active');

        // Get the section title color for the modal title
        var sectionTitle = section.querySelector('.section-title');
        var titleColor = sectionTitle ? window.getComputedStyle(sectionTitle).color : style.color;

        show_modal(data, color, type, titleColor, borderColor, darkMode);
    }
    item.setAttribute("title", optional);
    parent.appendChild(item);
}

// Displays the modal with the provided data and section colors
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

    // Apply section colors to modal
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

// Hides the modal if the click is outside the modal container
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

// Fills a section with quick reference items from data
function fill_section(data, parentname, type) {
    var parent = document.getElementById(parentname);
    data.forEach(function (item) {
        add_quickref_item(parent, item, type);
    });
}

// Initializes all quick reference sections and modal event
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

window.onload = function() {
    init();
    // Update item visibility after items are created
    handleRulesToggle();
}

// Handles settings switches and toggles for rules, dark mode, and homebrew
// Sets up event listeners and initial states
// Applies visibility and mode changes to items and page

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem('optional') === null) {
        localStorage.setItem('optional', 'false');
    }
    if (localStorage.getItem('homebrew') === null) {
        localStorage.setItem('homebrew', 'false');
    }

    var optionalCheckbox = document.getElementById('optional-switch');
    var homebrewCheckbox = document.getElementById('homebrew-switch');
    var darkModeCheckbox = document.getElementById('darkmode-switch');
    var rules2024Checkbox = document.getElementById('rules2024-switch');

    var rules2024 = localStorage.getItem('rules2024') === 'true';
    rules2024Checkbox.checked = rules2024;

    var darkmode = localStorage.getItem('darkmode') === 'true';
    darkModeCheckbox.checked = darkmode;

    var optional = localStorage.getItem('optional') === 'true';
    optionalCheckbox.checked = optional;

    var homebrew = localStorage.getItem('homebrew') === 'true';
    homebrewCheckbox.checked = homebrew;

    handleDarkModeToggle();

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

    // Updates item visibility based on optional and homebrew toggles
    function handleRulesToggle() {
        var items = document.getElementsByClassName('item itemsize');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var ruleType = item.getAttribute('title');
            var isOptional = ruleType === 'Optional rule';
            var isHomebrew = ruleType === 'Homebrew rule';
            if ((isOptional && optionalCheckbox.checked) ||
                (isHomebrew && homebrewCheckbox.checked) ||
                (!isOptional && !isHomebrew)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    }

    // Applies or removes dark mode classes and stores state
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

    // Handles 2024 rules toggle and reloads the page
    function handle2024RulesToggle() {
        localStorage.setItem('rules2024', rules2024Checkbox.checked ? 'true' : 'false');
        location.reload();
    }

    handleDarkModeToggle();

    var optionalToggleItem = document.getElementById('optional-toggle-item');
    var homebrewToggleItem = document.getElementById('homebrew-toggle-item');
    var darkModeToggleItem = document.getElementById('darkmode-toggle-item');
    var rules2024ToggleItem = document.getElementById('2024rules-toggle-item');

    // Helper to toggle checkboxes on click
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

    // Ensure correct item visibility on load
    handleRulesToggle();
});