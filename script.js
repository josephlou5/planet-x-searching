const GAME_SETTINGS = {
  mode: "game-mode",
  players: "num-players",
  difficulty: "difficulty",
};

const MODE_SETTINGS = {
  standard: {
    rules: [
      {
        object: "comet",
        count: 2,
        label: "Comets",
        rule: "only in prime sectors (2, 3, 5, 7, 11)",
      },
      {
        object: "asteroid",
        count: 4,
        label: "Asteroids",
        rule: "adjacent to at least 1 other <asteroid>",
      },
      {
        object: "dwarf-planet",
        count: 1,
        label: "Dwarf Planet",
        rule: "not adjacent to <planet-x>",
      },
      {
        object: "gas-cloud",
        count: 2,
        label: "Gas Clouds",
        rule: "adjacent to at least 1 <truly-empty>",
      },
      {
        object: "planet-x",
        count: 1,
        label: "Planet X",
        rule: "not adjacent to <dwarf-planet>; appears empty",
      },
      {
        object: "truly-empty",
        count: 2,
        label: "Truly Empty Sectors",
        rule: "(remember: <planet-x> appears empty)",
      },
    ],
    objects: {
      "planet-x": { count: 1 },
      "truly-empty": { count: 2 },
      "gas-cloud": { count: 2, points: 4 },
      "dwarf-planet": { count: 1, points: 4 },
      "asteroid": { count: 4, points: 2 },
      "comet": { count: 2, points: 2 },
    },
    research: ["A", "B", "C", "D", "E", "F"],
    conferences: ["X1"],
  },
  expert: {
    rules: [
      {
        object: "comet",
        count: 2,
        label: "Comets",
        rule: "only in prime sectors (2, 3, 5, 7, 11, 13, 17)",
      },
      {
        object: "asteroid",
        count: 4,
        label: "Asteroids",
        rule: "adjacent to at least 1 other <asteroid>",
      },
      {
        object: "dwarf-planet",
        count: 4,
        label: "Dwarf Planets",
        rule: "in a band of 6; not adjacent to <planet-x>",
      },
      {
        object: "gas-cloud",
        count: 2,
        label: "Gas Clouds",
        rule: "adjacent to at least 1 <truly-empty>",
      },
      {
        object: "planet-x",
        count: 1,
        label: "Planet X",
        rule: "not adjacent to <dwarf-planet>; appears empty",
      },
      {
        object: "truly-empty",
        count: 2,
        label: "Truly Empty Sectors",
        rule: "(remember: <planet-x> appears empty)",
      },
    ],
    objects: {
      "planet-x": { count: 1 },
      "truly-empty": { count: 5 },
      "gas-cloud": { count: 2, points: 4 },
      "dwarf-planet": { count: 4, points: 2 },
      "asteroid": { count: 4, points: 2 },
      "comet": { count: 2, points: 2 },
    },
    research: ["A", "B", "C", "D", "E", "F"],
    conferences: ["X1", "X2"],
  },
};
const DIFFICULTY_START_HINTS = {
  youth: 12,
  beginner: 8,
  experienced: 4,
  genius: 0,
};

const currentGameSettings = {};

String.prototype.toTitleCase = function () {
  return this.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

String.prototype.hyphenated = function () {
  return this.replace(/ /g, "-");
};

Array.fromRange = (length, func = null) =>
  new Array(length)
    .fill(null)
    .map((value, index, array) => (func ? func(index, array) : index));

$.fn.getId = function () {
  return this.get(0)?.id;
};

$.fn.forEach = function (func) {
  this.each((index, element) => func($(element), index));
  return this;
};

$.fn.mapEach = function (func) {
  const result = [];
  this.forEach(($element, index) => {
    const value = func($element, index);
    if (value == null) return;
    result.push(value);
  });
  return result;
};

$.fn.chooseClass = function (classes, key) {
  if (classes) {
    this.removeClass(Object.values(classes));
    if (key != null && key in classes) {
      this.addClass(classes[key]);
    }
  }
  return this;
};

/**
 * Helper functions for creating Bootstrap elements.
 * @namespace
 */
const BootstrapHtml = {
  input: function ({ inputClass = null, ...attrs } = {}) {
    attrs.type = "text";
    const classes = ["form-control"];
    if (inputClass != null) {
      classes.push(inputClass);
    }
    attrs.class = classes.join(" ");
    return $("<input>", attrs);
  },
  textarea: function ({ textareaClass = null, ...attrs } = {}) {
    const classes = ["form-control"];
    if (textareaClass != null) {
      classes.push(textareaClass);
    }
    attrs.class = classes.join(" ");
    return $("<textarea>", attrs);
  },
  buttonGroup: function (
    name,
    elements,
    {
      id = null,
      divClass = null,
      small = false,
      vertical = false,
      onlyValues = false,
      elementClass = null,
      elementAccent = null,
      ...attrs
    } = {}
  ) {
    // group div attrs
    if (id != null) {
      attrs.id = id;
    }
    const classes = [];
    if (vertical) {
      classes.push("btn-group-vertical");
    } else {
      classes.push("btn-group");
    }
    if (small) {
      classes.push("btn-group-sm");
    }
    if (divClass != null) {
      classes.push(divClass);
    }
    if (classes.length > 0) {
      attrs.class = classes.join(" ");
    }
    attrs.role = "group";

    // classes for each input
    const elementClasses = ["btn-check"];
    if (elementClass != null) {
      elementClasses.push(elementClass);
    }
    const inputClass = elementClasses.join(" ");

    function addButton(
      {
        id = null,
        value = null,
        attrs = null,
        checked = false,
        accent = null,
        content = null,
      },
      index
    ) {
      let elementId;
      if (id != null) {
        elementId = id;
      } else if (value != null) {
        elementId = `${name}-${String(value).hyphenated()}`;
      } else {
        elementId = `${name}-${index}`;
      }
      return [
        $("<input>", {
          type: "radio",
          id: elementId,
          name: name,
          class: inputClass,
          value: value,
          autocomplete: "off",
          checked: checked,
          ...attrs,
        }),
        $("<label>", {
          id: `${elementId}-label`,
          for: elementId,
          class: `btn btn-outline-${accent ?? elementAccent}`,
        }).append(content ?? value),
      ];
    }

    return $("<div>", attrs).append(
      elements.flatMap((options, index) =>
        addButton(onlyValues ? { value: options } : options, index)
      )
    );
  },
  dropdown: function (
    elements,
    {
      id = null,
      dropdownClass = null,
      defaultBlank = true,
      deleteDefault = true,
      onlyLabels = false,
      ...attrs
    } = {}
  ) {
    // select attrs
    if (id != null) {
      attrs.id = id;
    }
    const classes = ["form-select"];
    if (dropdownClass != null) {
      classes.push(dropdownClass);
    }
    attrs.class = classes.join(" ");

    // select the first element with `selected = true`
    let hasSelected = false;
    for (const option of elements) {
      if (option.selected) {
        if (hasSelected) {
          option.selected = false;
        } else {
          hasSelected = true;
        }
      }
    }

    function addOption({
      value = null,
      label,
      selected = false,
      disabled = false,
    }) {
      return $("<option>", { value: value ?? label, selected, disabled }).text(
        label
      );
    }

    const defaultOption =
      defaultBlank && !hasSelected
        ? $("<option>", {
            value: "",
            disabled: true,
            selected: true,
            default: true,
          }).text("-")
        : null;

    const $select = $("<select>", attrs);
    $select.append(
      defaultOption,
      elements.map((options) =>
        addOption(onlyLabels ? { label: options } : options)
      )
    );

    if (defaultBlank && deleteDefault) {
      $select.one("change", (event) => {
        // delete the first default option the first time an option is selected
        $select.children("[default]:disabled").forEach(($option) => {
          if ($option.text().trim() === "-") {
            $option.remove();
            return false;
          }
        });
      });
    }

    return $select;
  },
};

function isPrime(num) {
  if (num <= 1) return false;
  // first few primes
  if ([2, 3, 5, 7].includes(num)) return true;
  if (num % 2 === 0) return false;
  const sqrt = Math.floor(Math.sqrt(num));
  if (sqrt * sqrt === num) return false;
  for (let x = 3; x <= sqrt; x += 2) {
    if (num % x === 0) return false;
  }
  return true;
}

function getUrl(settings = {}) {
  const questionMarkIndex = document.URL.indexOf("?");
  let url =
    questionMarkIndex === -1
      ? document.URL
      : document.URL.slice(0, questionMarkIndex);
  const args = [];
  for (const key of Object.keys(GAME_SETTINGS)) {
    const value = settings[key];
    if (value == null) continue;
    args.push(`${key}=${value}`);
  }
  if (args.length > 0) {
    url += "?" + args.join("&");
  }
  return url;
}

function createObjectImage(object, attrs = {}) {
  attrs.src = `images/${object}.png`;
  attrs.alt = object.toTitleCase();
  return $("<img>", attrs);
}

function toggleImageWhiteVariant(selector) {
  $(selector).on("change", (event) => {
    const name = $(event.target).attr("name");
    $(`${selector}[name="${name}"]`).forEach(($input) => {
      let variant = "";
      if ($input.prop("checked")) {
        // set image to white variant
        variant = "-white";
      }
      const object = $input.val();
      const labelId = $input.getId() + "-label";
      $(`#${labelId} img`).attr("src", `images/${object}${variant}.png`);
    });
  });
}

/** Starts the game by initializing the page with the given game settings. */
function startGame(gameSettings) {
  if (gameSettings.players != null) {
    const players = Number(gameSettings.players);
    if (isNaN(players)) {
      gameSettings.players = null;
    } else {
      gameSettings.players = players;
    }
  }
  const { mode, difficulty } = gameSettings;

  const $gameSettings = $("#game-settings");
  if ($gameSettings.length === 0) return;

  const settings = MODE_SETTINGS[mode];
  if (settings == null) return;
  const numSectors = settings.numSectors;
  const objectSettings = settings.objects;

  // delete game selection buttons
  $gameSettings.remove();

  // show reset buttons
  $("#reset-buttons").removeClass("d-none");
  // show board
  $("#board").removeClass("d-none");
  $("#difficulty").text(difficulty.toTitleCase());
  // add settings to url
  history.replaceState(null, "", getUrl(gameSettings));

  // initialize hints table
  const $head = $("#sectors-head");
  const $oppositeRow = $("#opposite-row");
  const $objectRows = $(".object-row");
  // number of objects
  $head.append($("<th>", { class: "small-col" }).text("Count"));
  // opposite sector
  $oppositeRow.append($("<td>"));
  // object counts
  $objectRows.forEach(($row) => {
    if ($row.attr("notes")) {
      $row.append($("<td>"));
      return;
    }
    const object = $row.attr("object");
    const info = objectSettings[object];
    $row.append(
      $("<td>", { id: `${object}-count-cell` }).append(
        $("<span>", { id: `${object}-count` }).text("0"),
        ` / ${info.count}`
      )
    );
  });
  for (let i = 0; i < numSectors; i++) {
    const sector = i + 1;
    $head.append($("<th>").text(`Sector ${sector}`));
    // add the opposite sector number
    const opposite = ((i + numSectors / 2) % numSectors) + 1;
    $oppositeRow.append($("<td>").text(`Sector ${opposite}`));
    // add radio groups for the entire row
    $objectRows.forEach(($row) => {
      if ($row.attr("notes")) {
        $row.append(
          $("<td>").append(BootstrapHtml.textarea({ placeholder: "Notes" }))
        );
        return;
      }
      const object = $row.attr("object");
      if (object === "comet") {
        // special case: only put hints in prime number sectors
        if (!isPrime(sector)) {
          $row.append($("<td>", { class: "bg-secondary-subtle" }));
          return;
        }
      }
      const radioName = `${object}-sector${sector}`;
      $row.append(
        $("<td>", { id: `${radioName}-cell`, class: "hint-cell" }).append(
          BootstrapHtml.buttonGroup(
            radioName,
            [
              { hint: "no", accent: "danger", icon: "x-lg" },
              {
                hint: "maybe",
                accent: "secondary",
                checked: true,
                icon: "question-lg",
              },
              { hint: "yes", accent: "success", icon: "check-lg" },
            ].map(({ hint, accent, icon, checked = false }) => {
              return {
                value: hint,
                attrs: { object, sector, hint },
                checked: checked,
                accent: accent,
                content: $("<i>", { class: `bi bi-${icon}` }),
              };
            }),
            { small: true, elementClass: "hint-radio" }
          )
        )
      );
    });
  }

  // logic rules
  $("#logic-rules-body").append(
    settings.rules.map(({ object, count, label, rule }) => {
      // parse rule in case it includes other object images
      const ruleCell = [];
      let prevIndex = 0;
      while (true) {
        const startIndex = rule.indexOf("<", prevIndex);
        if (startIndex === -1) {
          // no more tags
          ruleCell.push($("<span>").text(rule.slice(prevIndex)));
          break;
        }
        const endIndex = rule.indexOf(">", startIndex + 1);
        if (endIndex === -1) {
          // no end tag; assume the rest of the string is invalid
          ruleCell.push($("<span>").text(rule.slice(prevIndex)));
          break;
        }
        const object = rule.slice(startIndex + 1, endIndex);
        if (!(object in objectSettings)) {
          // invalid object; leave as-is
          ruleCell.push($("<span>").text(rule.slice(startIndex, endIndex + 1)));
        } else {
          if (startIndex > prevIndex) {
            ruleCell.push($("<span>").text(rule.slice(prevIndex, startIndex)));
          }
          ruleCell.push(createObjectImage(object, { class: "small-object" }));
        }
        prevIndex = endIndex + 1;
      }

      return $("<tr>").append(
        $("<td>").append(createObjectImage(object)),
        $("<td>").text(count),
        $("<td>").text(label),
        $("<td>").append(ruleCell)
      );
    })
  );

  // populate points for each object (in final score calculator)
  for (const [key, { points }] of Object.entries(objectSettings)) {
    if (points == null) continue;
    $(`#${key}-per-points`).text(points);
  }

  // initialize starting info table
  const numStartingHints = DIFFICULTY_START_HINTS[difficulty] ?? 0;
  if (numStartingHints === 0) {
    $("#starting-info-section").remove();
  } else {
    $("#starting-info-list").append(
      Array.fromRange(numStartingHints, (index) => {
        const hintRadioName = `starting-info-${index}-object`;
        return $("<li>", { class: "mb-1" }).append(
          $("<div>", { class: "row gx-2 flex-nowrap text-nowrap" }).append(
            $("<div>", { class: "col-auto col-form-label" }).text("Sector"),
            $("<div>", { class: "col-auto" }).append(
              BootstrapHtml.dropdown(
                Array.fromRange(numSectors, (index) => index + 1),
                { onlyLabels: true }
              )
            ),
            $("<div>", { class: "col-auto col-form-label" }).text("is not a"),
            BootstrapHtml.buttonGroup(
              hintRadioName,
              ["asteroid", "comet", "dwarf-planet", "gas-cloud"].map(
                (object) => {
                  const objectId = `${hintRadioName}-${object}`;
                  return {
                    id: objectId,
                    value: object,
                    content: [
                      createObjectImage(object),
                      " ",
                      object.toTitleCase(),
                    ],
                  };
                }
              ),
              {
                divClass: "col-auto",
                elementClass: "starting-info-object-hint",
                elementAccent: "secondary",
              }
            )
          )
        );
      })
    );
    toggleImageWhiteVariant(".starting-info-object-hint");
  }

  // initialize research table
  $("#research-body").append(
    settings.research.map((letter) =>
      $("<tr>").append(
        $("<th>", { scope: "row" }).text(letter),
        $("<td>").append(BootstrapHtml.input({ placeholder: "Topic" })),
        $("<td>").append(
          BootstrapHtml.textarea({ rows: 1, placeholder: "Notes" })
        )
      )
    ),
    settings.conferences.map((letter) =>
      $("<tr>").append(
        $("<th>", { scope: "row" }).text(letter),
        $("<td>").append(
          $("<div>", { class: "row gx-2" }).append(
            $("<div>", { class: "col-auto col-form-label" }).text("Planet X &"),
            $("<div>", { class: "col" }).append(
              BootstrapHtml.input({ placeholder: "Topic" })
            )
          )
        ),
        $("<td>").append(
          BootstrapHtml.textarea({ rows: 1, placeholder: "Notes" })
        )
      )
    )
  );

  // set the global settings
  Object.assign(currentGameSettings, gameSettings);

  // initialize moves table
  addMoveRow();
}

let movesCounter = 0;
/** Adds a row to the moves table. */
function addMoveRow() {
  const numPlayers = currentGameSettings.players;
  const numSectors = MODE_SETTINGS[currentGameSettings.mode].numSectors;

  const MOVE_ROW_CLASS = "move-row";
  const PLAYER_SELECT_CLASS = "move-player";

  const moveNum = movesCounter++;
  const moveId = `move${moveNum}`;
  const timeCostId = `${moveId}-time`;
  const playerRadioName = `${moveId}-player`;
  const actionSelectId = `${moveId}-action`;
  const actionArgsClass = `${actionSelectId}-args`;
  const surveyObjectRadioName = `${actionSelectId}-survey-object`;
  const surveySectorStartSelectId = `${actionSelectId}-survey-sector-start`;
  const surveySectorEndSelectId = `${actionSelectId}-survey-sector-end`;
  $("#moves-body").append(
    $("<tr>", {
      id: moveId,
      class: MOVE_ROW_CLASS,
      moveNum: moveNum,
      new: "true",
    }).append(
      // player column
      $("<td>").append(
        BootstrapHtml.buttonGroup(
          playerRadioName,
          Array.fromRange(numPlayers, (index) => {
            return { value: index + 1, attrs: { move: moveId } };
          }),
          { divClass: PLAYER_SELECT_CLASS, elementAccent: "success" }
        )
      ),
      // action column
      $("<td>", { class: "moves-table-col" }).append(
        // do "mt-2" on the args divs so that there is no bottom space if they
        // are hidden (doing "mb-2" here will cause a space)
        $("<div>", { class: "row gx-2 align-items-center" }).append(
          $("<div>", { class: "col" }).append(
            BootstrapHtml.dropdown(
              [
                { value: "survey", label: "Survey" },
                { value: "target", label: "Target" },
                { value: "research", label: "Research" },
                { value: "locate", label: "Locate Planet X" },
              ],
              { id: actionSelectId, move: moveId }
            ),
            $("<div>", {
              id: `${actionSelectId}-feedback`,
              class: "invalid-feedback",
            })
          ),
          $("<div>", { id: timeCostId, class: "col-auto d-none" }).append(
            "+",
            $("<span>", { id: `${timeCostId}-num`, class: "me-1" }),
            createObjectImage("time", { class: "time" })
          )
        ),
        // survey args
        $("<div>", {
          class: `${actionArgsClass} mt-2 d-none`,
          action: "survey",
        }).append(
          $("<div>", { class: "mb-2" }).append(
            BootstrapHtml.buttonGroup(
              surveyObjectRadioName,
              ["asteroid", "comet", "dwarf-planet", "gas-cloud"].map(
                (object) => {
                  return {
                    value: object,
                    content: createObjectImage(object),
                  };
                }
              ),
              { elementAccent: "secondary", elementClass: "" }
            )
          ),
          $("<div>", { class: "row gx-2 align-items-center" }).append(
            $("<div>", { class: "col-auto" }).text("Sector"),
            $("<div>", { class: "col-auto" }).append(
              BootstrapHtml.dropdown(
                Array.fromRange(numSectors, (index) => index + 1),
                { id: surveySectorStartSelectId, onlyLabels: true }
              )
            ),
            $("<div>", { class: "col-auto" }).text("to"),
            $("<div>", { class: "col-auto" }).append(
              BootstrapHtml.dropdown([], { id: surveySectorEndSelectId })
            )
          )
        ),
        // target args
        $("<div>", {
          class: `${actionArgsClass} row gx-2 align-items-center mt-2 d-none`,
          action: "target",
        }).append(
          $("<div>", { class: "col-auto" }).text("Sector"),
          $("<div>", { class: "col-auto" }).append(
            BootstrapHtml.dropdown(
              Array.fromRange(numSectors, (index) => index + 1),
              { onlyLabels: true }
            )
          )
        ),
        // research args
        $("<div>", {
          class: `${actionArgsClass} mt-2 d-none`,
          action: "research",
        }).append(
          BootstrapHtml.buttonGroup(
            `${actionSelectId}-research-area`,
            MODE_SETTINGS[currentGameSettings.mode].research,
            { onlyValues: true, elementAccent: "secondary" }
          )
        )
      ),
      // notes column
      $("<td>", { class: "moves-table-col" }).append(
        BootstrapHtml.textarea({ rows: 1, placeholder: "Notes" })
      )
    )
  );

  function getSelected($select) {
    // `$select.val()` doesn't work with disabled options, so loop manually
    let selected = null;
    $select.children("option").forEach(($option) => {
      if ($option.attr("default")) return;
      if ($option.prop("selected")) {
        selected = $option.attr("value");
        return false;
      }
    });
    return selected;
  }

  function setTimeCost(cost = null) {
    const $cost = $(`#${timeCostId}`);
    if (!cost) {
      $cost.addClass("d-none");
    } else {
      $cost.removeClass("d-none");
      $(`#${timeCostId}-num`).text(cost);
    }
  }

  function calcSurveyCost({
    start = undefined,
    end = undefined,
    setText = false,
  } = {}) {
    if (start === undefined) {
      start = getSelected($(`#${surveySectorStartSelectId}`));
    }
    if (end === undefined) {
      end = getSelected($(`#${surveySectorEndSelectId}`));
    }
    if (start == null || end == null) {
      if (setText) setTimeCost();
      return null;
    }
    start = Number(start);
    end = Number(end);
    if (end < start) {
      // wrap-around
      end += numSectors;
    }
    const numSectorsSurveyed = end - start + 1;
    console.log("start:", start, "end:", end, "diff:", numSectorsSurveyed);
    const cost = 4 - Math.floor((numSectorsSurveyed - 1) / 3);
    if (setText) setTimeCost(cost);
    return text;
  }

  // only includes the player and action selections (not notes)
  $(`[move="${moveId}"]`).on("change", (event) => {
    // if this is a new row, add another row since this one is now changed
    const $row = $(`#${moveId}`);
    if ($row.attr("new")) {
      $row.attr("new", null);
      // add a new row after this one
      addMoveRow();
    }

    // calculate the time cost for this action
    const currAction = getSelected($row.find(`#${actionSelectId}`));
    if (currAction != null) {
      let cost = null;
      if (currAction === "survey") {
        cost = calcSurveyCost();
      } else if (currAction === "target") {
        cost = 4;
      } else if (currAction === "research") {
        cost = 1;
      } else if (currAction === "locate") {
        cost = 5;
      }
      setTimeCost(cost);
    }

    // validate all moves
    const playerMoves = {};
    $(`.${MOVE_ROW_CLASS}`).forEach(($row) => {
      if ($row.prop("new")) return;
      const moveId = $row.getId();
      const moveNum = Number($row.attr("moveNum"));
      // find selected player
      const playerStr = $row
        .find(`input[name="${moveId}-player"]:checked`)
        .attr("value");
      if (playerStr == null) return;
      const player = Number(playerStr);
      // find selected action (can be null)
      const $actionSelect = $row.find(`#${moveId}-action`);
      const actionId = $actionSelect.getId();
      const $actionFeedback = $(`#${actionId}-feedback`);
      const action = getSelected($actionSelect);
      // save this player's move
      if (!(player in playerMoves)) {
        playerMoves[player] = [];
      }
      playerMoves[player].push({
        moveNum,
        $actionSelect,
        $actionFeedback,
        action,
      });
    });
    for (const [player, moves] of Object.entries(playerMoves)) {
      const ordered = moves.sort((a, b) => a.moveNum - b.moveNum);
      let numTargets = 0;
      let lastAction = null;
      for (const { $actionSelect, $actionFeedback, action } of ordered) {
        $actionSelect.removeClass("is-invalid");
        $actionSelect.children("option:not([default])").prop("disabled", false);
        if (lastAction === "research") {
          // cannot research two times in a row
          if (action === "research") {
            $actionSelect.addClass("is-invalid");
            $actionFeedback.text(
              `Player ${player}: Cannot research two times in a row`
            );
          }
          // disable
          $actionSelect
            .children('option[value="research"]')
            .prop("disabled", true);
        }
        if (numTargets >= 2) {
          if (action === "target") {
            // cannot target more than two times
            $actionSelect.addClass("is-invalid");
            $actionFeedback.text(
              `Player ${player}: Cannot target more than two times`
            );
          }
          // disable
          $actionSelect
            .children('option[value="target"]')
            .prop("disabled", true);
        }
        lastAction = action;
        if (action === "target") {
          numTargets++;
        }
      }
    }
  });

  // when the action is changed, show its args
  $(`#${actionSelectId}`).on("change", (event) => {
    const action = $(`#${actionSelectId}`).val();
    // hide all the other args
    $(`.${actionArgsClass}`).forEach(($args) => {
      $args.toggleClass("d-none", $args.attr("action") !== action);
    });
  });

  // survey args
  const surveyObjectRadioSelector = `input[name="${surveyObjectRadioName}"]`;
  toggleImageWhiteVariant(surveyObjectRadioSelector);
  $(surveyObjectRadioSelector).on("change", (event) => {
    const isComet = $(`${surveyObjectRadioSelector}[value="comet"]`).prop(
      "checked"
    );

    const $startSelect = $(`#${surveySectorStartSelectId}`);

    $startSelect.children("option").forEach(($option) => {
      if ($option.attr("default")) return;
      if (isComet) {
        // disable non-prime numbers
        if (!isPrime(Number($option.attr("value")))) {
          $option.prop("disabled", true);
        }
      } else {
        // un-disable everything
        $option.prop("disabled", false);
      }
    });

    if (getSelected($startSelect) != null) {
      // if nothing was selected yet, just leave it
      // otherwise, trigger a change to update the end sector select
      $startSelect.trigger("change");
    }
  });
  $(`#${surveySectorStartSelectId}`).on("change", (event) => {
    const isComet = $(`${surveyObjectRadioSelector}[value="comet"]`).prop(
      "checked"
    );

    const $startSelect = $(`#${surveySectorStartSelectId}`);
    const startValue = getSelected($startSelect);
    const $endSelect = $(`#${surveySectorEndSelectId}`);

    const sectors = [];
    let invalidIsSelected = false;
    if (startValue != null) {
      const startSector = Number(startValue);
      const endValue = getSelected($endSelect);
      const endSector = endValue != null ? Number(endValue) : null;

      // mark as invalid if not a prime number
      $startSelect.toggleClass("is-invalid", isComet && !isPrime(startSector));

      // can end in the same sector
      // limited by the visible sky (at most half of the sectors)
      for (let i = 0; i < numSectors / 2; i++) {
        const sectorNum = ((startSector - 1 + i) % numSectors) + 1;
        const selected = sectorNum === endSector;
        const sectorOption = {
          label: sectorNum,
          selected: selected,
        };
        if (isComet && !isPrime(sectorNum)) {
          // disable it
          sectorOption.disabled = true;
          if (selected) {
            invalidIsSelected = true;
          }
        }
        sectors.push(sectorOption);
      }
    }

    // recreate the end sector select
    $endSelect.replaceWith(
      BootstrapHtml.dropdown(sectors, { id: surveySectorEndSelectId })
    );

    calcSurveyCost({ start: startValue, setText: true });

    const $newEndSelect = $(`#${surveySectorEndSelectId}`);
    $newEndSelect.toggleClass("is-invalid", invalidIsSelected);
    $newEndSelect.on("change", (event) => {
      const isComet = $(`${surveyObjectRadioSelector}[value="comet"]`).prop(
        "checked"
      );

      const $endSelect = $(`#${surveySectorEndSelectId}`);
      const endValue = getSelected($endSelect);
      if (endValue == null) return;
      const endSector = Number(endValue);

      calcSurveyCost({ end: endSector, setText: true });

      // mark as invalid if not a prime number
      $endSelect.toggleClass("is-invalid", isComet && !isPrime(endSector));
    });
  });
}

/** Parses the URL for the game settings. */
function parseUrl() {
  const questionMarkIndex = document.URL.indexOf("?");
  if (questionMarkIndex === -1) return;
  const args = decodeURI(document.URL.slice(questionMarkIndex + 1)).split("&");
  // find last time args are specified
  const options = {};
  for (const arg of args) {
    const parts = arg.split("=");
    if (parts.length !== 2) continue;
    const [name, value] = parts;
    if (!(name in GAME_SETTINGS)) continue;
    options[name] = value;
  }
  // set args
  let allArgsSet = true;
  for (const [key, name] of Object.entries(GAME_SETTINGS)) {
    const value = options[key];
    if (value == null) {
      allArgsSet = false;
      continue;
    }
    let success = false;
    $(`input[name="${name}"]`).forEach(($input) => {
      // use weak inequality for numbers
      if ($input.val() == value) {
        $input.prop("checked", true);
        success = true;
        return false;
      }
    });
    if (!success) {
      allArgsSet = false;
      // clear the value
      options[key] = null;
    }
  }
  // set proper url args
  history.replaceState(null, "", getUrl(options));
  return allArgsSet;
}

$(() => {
  // initialize mode choice
  const modeAccents = { standard: "primary", expert: "danger" };
  $("#game-mode-group").append(
    BootstrapHtml.buttonGroup(
      GAME_SETTINGS.mode,
      Object.entries(MODE_SETTINGS).map(([mode, settings]) => {
        const numSectors = Object.values(settings.objects).reduce(
          (total, { count }) => total + count,
          0
        );
        // cache this value
        MODE_SETTINGS[mode].numSectors = numSectors;
        return {
          id: `${mode}-mode`,
          value: mode,
          accent: modeAccents[mode],
          content: `${mode.toTitleCase()} (${numSectors} sectors)`,
        };
      }),
      { divClass: "dynamic-vertical-btn-group" }
    )
  );
  // initialize difficulty choice
  $("#difficulty-group").append(
    BootstrapHtml.buttonGroup(
      GAME_SETTINGS.difficulty,
      Object.entries(DIFFICULTY_START_HINTS).map(([level, numFacts]) => {
        return {
          value: level,
          content: `${level.toTitleCase()} (${numFacts} facts)`,
        };
      }),
      { divClass: "dynamic-vertical-btn-group", elementAccent: "primary" }
    )
  );

  // change button groups to vertical when the screen is small
  $(window)
    .on("resize", (event) => {
      const $btnGroups = $(".dynamic-vertical-btn-group");
      if ($btnGroups.length === 0) {
        // no longer choosing game settings
        $(window).off(event);
        return;
      }
      $btnGroups.chooseClass(
        { regular: "btn-group", vertical: "btn-group-vertical" },
        window.matchMedia("(min-width: 800px)").matches ? "regular" : "vertical"
      );
    })
    .trigger("resize");

  function getGameSettings() {
    let invalid = false;
    const settings = Object.fromEntries(
      Object.entries(GAME_SETTINGS).map(([key, name]) => {
        let value = null;
        $(`input[name="${name}"]`).forEach(($input) => {
          if ($input.prop("checked")) {
            value = $input.val();
            return false;
          }
        });
        if (value == null) invalid = true;
        return [key, value];
      })
    );
    return [invalid, settings];
  }

  $("#start-game-btn").on("click", (event) => {
    const [invalid, settings] = getGameSettings();
    if (invalid) return;

    startGame(settings);

    // new game button
    $("#new-game-btn").on("click", (event) => {
      if (!confirm("Are you sure you want to start a new game?")) return;
      location.href = getUrl();
    });
    // reset button
    $("#reset-btn").on("click", (event) => {
      if (!confirm("Are you sure you want to reset the game?")) return;
      location.href = getUrl(currentGameSettings);
    });

    // update hints table whenever a hint is changed
    const BG_COLOR_CLASSES = {
      success: "bg-success-subtle",
      danger: "bg-danger-subtle",
    };
    const TEXT_COLOR_CLASSES = {
      success: "text-success",
      danger: "text-danger",
    };
    $(".hint-radio").on("change", (event) => {
      const $input = $(event.target);
      // get the count for this object
      const object = $input.attr("object");
      const $objectRadios = $(`.hint-radio[object="${object}"]`);
      const numObjects = $objectRadios.filter('[hint="yes"]:checked').length;
      // update count text and cell color
      const limit =
        MODE_SETTINGS[currentGameSettings.mode].objects[object].count;
      let cellClass = null;
      let countClass = null;
      if (numObjects === limit) {
        cellClass = "success";
        countClass = "success";
      } else if (numObjects > limit) {
        cellClass = "danger";
        countClass = "danger";
      } else if (
        numObjects + $objectRadios.filter('[hint="maybe"]:checked').length <
        limit
      ) {
        // not enough "maybe" buttons left for object count
        cellClass = "danger";
      }
      $(`#${object}-count-cell`).chooseClass(BG_COLOR_CLASSES, cellClass);
      $(`#${object}-count`)
        .text(numObjects)
        .chooseClass(TEXT_COLOR_CLASSES, countClass);
      // update the hint cell colors for this sector (there must be exactly
      // object per sector)
      const sector = $input.attr("sector");
      const $sectorRadios = $(`.hint-radio[sector="${sector}"]`);
      const $sectorYesRadios = $sectorRadios.filter('[hint="yes"]');
      const numYes = $sectorYesRadios.filter(":checked").length;
      const numMaybe = $sectorRadios.filter('[hint="maybe"]:checked').length;
      $sectorYesRadios.forEach(($input) => {
        let classKey = null;
        if (numMaybe === 0 && numYes === 0) {
          // entire sector is marked as "no", which is bad
          classKey = "danger";
        } else if ($input.prop("checked")) {
          if (numYes === 1) {
            // the only one that's checked
            classKey = "success";
          } else {
            // multiple are checked, and this is one of them
            classKey = "danger";
          }
        }
        const name = $input.attr("name");
        $(`#${name}-cell`).chooseClass(BG_COLOR_CLASSES, classKey);
      });
      if (numYes === 1 && $input.attr("hint") === "no") {
        // change everything else in this sector from "maybe" to "no"
        // (doesn't trigger this handler again)
        $sectorRadios.filter('[hint="maybe"]:checked').forEach(($input) => {
          const name = $input.attr("name");
          $(`#${name}-no`).prop("checked", true);
        });
      }
    });

    // final score calculator
    $("#score-table input").on("change", (event) => {
      let total = 0;
      // first theory points
      total += Number($("#first-theory-points").val());
      // object points
      for (const [key, { points }] of Object.entries(
        MODE_SETTINGS[currentGameSettings.mode].objects
      )) {
        if (points == null) continue;
        const count = Number($(`#${key}-points`).val());
        total += count * points;
      }
      // locating planet x points
      total += Number($("#locate-planet-x-points").val());
      $("#score-total").text(total);
    });

    // buttons to show/hide sections
    for (const name of [
      "logic-rules",
      "score-calculator",
      "starting-info",
      "research-notes",
    ]) {
      const btnSelector = `#hide-${name}-btn`;
      $(btnSelector).on("click", (event) => {
        const $btn = $(btnSelector);
        const showing = $btn.text().trim() === "Show";
        // toggle section
        $(`#${name}`).toggleClass("d-none", !showing);
        // toggle button
        $btn
          .chooseClass(
            { success: "btn-outline-success", danger: "btn-outline-danger" },
            showing ? "danger" : "success"
          )
          .text(showing ? "Hide" : "Show");
      });
    }

    // hide the final score calculator by default
    $("#hide-score-calculator-btn").trigger("click");
  });

  function checkStartButton() {
    const [invalid, settings] = getGameSettings();
    $("#start-game-btn").prop("disabled", invalid);
    return !invalid;
  }

  $("#game-settings input").on("change", (event) => {
    checkStartButton();
  });

  // initialize with the proper mode
  if (parseUrl()) {
    if (checkStartButton()) {
      // start the game
      $("#start-game-btn").trigger("click");
    }
  }
});
