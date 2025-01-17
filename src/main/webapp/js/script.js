const countPerPage = $('#countPerPage');
const form = $('form');
var activeButtonNumber;

function getPageSize() {
    return countPerPage.val();
}

function getPlayersCount() {
    let playersData;
    $.ajax({
        url: "/rest/players/count",
        type: 'get',
        dataType: 'html',
        async: false,
        success: function (data) {
            playersData = data;
        }
    });
    return playersData;
}

function getPageCount() {
    const playersCount = getPlayersCount();
    const pageSize = getPageSize();
    return Math.ceil(playersCount / pageSize);
}

function addInputInCell(cell) {
    const value = cell.text();
    cell.text('');

    if ($(cell).hasClass('race')) {
        cell.append('<select class="raceSelect"></select>');
        $(cell).find('.raceSelect').append(getRaceOptions());
        $(cell).find('.raceSelect').val(value);
    } else if ($(cell).hasClass('profession')) {
        cell.append('<select class="professionSelect"></select>');
        $(cell).find('.professionSelect').append(getProfessionOptions());
        $(cell).find('.professionSelect').val(value);
    } else if ($(cell).hasClass('banned')) {
        cell.append('<select class="banSelect"></select>');
        $(cell).find('.banSelect').append(getBanOptions());
        $(cell).find('.banSelect').val(value);
    } else {
        cell.append('<input value="' + value + '"/>');
    }
}

function getRaceOptions() {
    let option = '';
    option += '<option value="HUMAN">HUMAN</option>';
    option += '<option value="DWARF">DWARF</option>';
    option += '<option value="ELF">ELF</option>';
    option += '<option value="GIANT">GIANT</option>';
    option += '<option value="ORC">ORC</option>';
    option += '<option value="TROLL">TROLL</option>';
    option += '<option value="HOBBIT">HOBBIT</option>';

    return option;
}

function getProfessionOptions() {
    let option = '';
    option += '<option value="WARRIOR">WARRIOR</option>';
    option += '<option value="ROGUE">ROGUE</option>';
    option += '<option value="SORCERER">SORCERER</option>';
    option += '<option value="CLERIC">CLERIC</option>';
    option += '<option value="PALADIN">PALADIN</option>';
    option += '<option value="NAZGUL">NAZGUL</option>';
    option += '<option value="WARLOCK">WARLOCK</option>';

    return option;
}

function getBanOptions() {
    let option = '';
    option += '<option value="true">false</option>';
    option += '<option value="false">true</option>';

    return option;
}

function setActiveButton(buttonNumber) {
    $('.pageButton, .active').removeClass('active');
    const id = 'button' + buttonNumber;
    $('#' + id).addClass('active');
    activeButtonNumber = buttonNumber;
}

function updatePlayersList(pageNumber) {
    let pageSize = getPageSize();
    let url = '/rest/players?' + $.param({
        "pageNumber": pageNumber,
        "pageSize": pageSize
    });
    $.get(url, (data) => {
        // Очищаем строки в таблице.
        $('#playersData tbody tr').remove();

        // Формируем новые строки.
        for (let i = 0; i < data.length; i++) {
            let user = '<tr>';

            // Перебираем id колонок и используем их как ключи для получения значения в загруженном объекте.
            $("#playersData thead tr th").each(function () {
                let key = $(this).attr('class');
                if (key === 'edit') {
                    user += '<td class="editAccount"><img class="img" width="40" src="/img/my-edit.png" alt="edit.png"></td>';
                } else if (key === 'delete') {
                    user += '<td class="deleteAccount"><img class="img" width="40" src="/img/my-delete.png" alt="delete.png"></td>';
                } else if (key === 'birthday') {
                    let value = new Date(data[i][key]).toLocaleDateString("en-US");
                    user += '<td class="' + key + '">' + value + '</td>';
                } else {
                    let value = data[i][key];
                    user += '<td class="' + key + '">' + value + '</td>';
                }
            })

            user += '</tr>';
            $('#playersData tbody').append(user);
        }
    });
}

function updatePageButtons(activeButton = 1) {
    $('.pageButton').remove();

    let pageCount = getPageCount();
    for (let i = 1; i <= pageCount; i++) {
        let id = 'button' + i;
        $('#pageButtons').append('<button id="' + id + '" class="pageButton">' + i + '</button>');
    }

    setActiveButton(activeButton);
}

function deleteAccount(id) {
    $.ajax({
        url: `/rest/players/${id}`,
        type: 'DELETE',
        async: false,
        success: function (result) {
            alert(`(id ${id}) Account  successfully deleted!`)
        },
        error: function (request, msg, error) {
            if (request.status === 404) {
                alert(`(id ${id}) Player  not found!`)
            } else if (request.status === 400) {
                alert(`(id ${id}) Bad player id`)
            } else {
                alert(`(id ${id}) ${msg}`);
            }
        }
    });
}

function updatePlayerData(dataParams, id) {
    $.ajax({
        url: `/rest/players/${id}`,
        type: 'POST',
        data: JSON.stringify(dataParams),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (result) {
            alert(`(id ${id}) Account  successfully updated!`)
        },
        error: function (request, msg, error) {
            if (request.status === 404) {
                alert(`(id ${id}) Player  not found!`)
            } else if (request.status === 400) {
                alert(`(id ${id}) Bad player id`)
            } else {
                alert(`(id ${id}) ${msg}`)
            }
        }
    });
}

function createNewAccount(dataParams) {
    $.ajax({
        url: `/rest/players/`,
        type: 'POST',
        data: JSON.stringify(dataParams),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (result) {
            alert(`Account successfully created!`)
        },
        error: function (request, msg, error) {
            if (request.status === 400) {
                alert(`Bad player input data!`)
            } else {
                alert(`(id ${id}) ${msg}`)
            }
        }
    });
}

function initializeNewAccountSection() {
    const name = $('#newAccountName');
    const title = $('#newAccountTitle');
    const race = $('#newAccountRace');
    const profession = $('#newAccountProfession');
    const level = $('#newAccountLevel');
    const birthday = $('#newAccountBirthday');
    const banned = $('#newAccountBanned');

    name.val('');
    title.val('');
    race.find('option').remove();
    race.append(getRaceOptions());
    profession.find('option').remove();
    profession.append(getProfessionOptions());
    level.val('');
    birthday.val('');
    banned.find('option').remove();
    banned.append(getBanOptions());

    form.find('span').empty();
}

function updateValidityDisplay(input) {
    const span = $(input).next("span");
    span.empty();
    if (input.validity.valid) {
        span.text('\u2713').css("color", "green");
    } else {
        span.text('\u2716').css("color", "red");
    }
}

// Обработчик при загрузке документа.
$(document).ready(() => {
    updatePlayersList(0);
    updatePageButtons();
    initializeNewAccountSection();
})

// Обработчик изменений countPerPage.
countPerPage.change(function () {
    updatePlayersList(0);
    updatePageButtons();
})

// Обработчик нажатия кнопок страниц.
$(document).on('click', '.pageButton', function () {
    const button = $(this);
    const pageNumber = button.text();
    updatePlayersList(pageNumber - 1);
    setActiveButton(pageNumber);
})

// Обработчик удаления аккаунта.
$(document).on('click', '.deleteAccount', function () {
    const row = $(this).parent();
    const id = row.find('.id').text();
    deleteAccount(id);

    const playerCount = getPlayersCount();
    const pageSize = getPageSize();
    if (playerCount % pageSize === 0) {
        updatePageButtons(activeButtonNumber - 1);
    }
    updatePlayersList(activeButtonNumber - 1);
})

// Обработчик редактирования аккаунта.
$(document).on('click', '.editAccount', function () {
    const row = $(this).parent();

    const nameCell = $(row).find('.name');
    addInputInCell(nameCell);

    const titleCell = $(row).find('.title');
    addInputInCell(titleCell);

    const raceCell = $(row).find('.race');
    addInputInCell(raceCell);

    const professionCell = $(row).find('.profession');
    addInputInCell(professionCell);

    const bannedCell = $(row).find('.banned');
    addInputInCell(bannedCell);

    const editCell = $(row).find('.editAccount');
    editCell.removeClass('editAccount');
    editCell.addClass('saveAccount');
    editCell.find('.img').attr('src', '/img/my-save.png');

    const deleteCell = $(row).find('.deleteAccount');
    deleteCell.removeClass('deleteAccount');
    deleteCell.find('.img').css('display', 'none');
})

// Обработчик сохранения аккаунта.
$(document).on('click', '.saveAccount', function () {
    $('#playersData tbody .saveAccount').each(function () {
        const row = $(this).parent()
        const id = row.find('.id').text()
        const dataParams = {
            name: row.find('.name [value]').val(),
            title: row.find('.title [value]').val(),
            race: row.find('.raceSelect').val(),
            profession: row.find('.professionSelect').val(),
            banned: row.find('.banSelect').val()
        }
        updatePlayerData(dataParams, id);
    });
    updatePlayersList(activeButtonNumber - 1);
})

// Обработчик создания нового аккаунта.
form.on("submit", function (event) {
    event.preventDefault();

    // Проверяем валидность введенных данных и заполняем параметры.
    let dataParam = {};
    const inputs = $(this).find('input, select');
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        updateValidityDisplay(input);
        if (!input.checkValidity()) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        const key = input.className.split(' ')[1];
        const value = key === 'birthday' ? new Date(input.value).getTime() : input.value;
        dataParam[key] = value;
    }

    createNewAccount(dataParam);
    updatePlayersList(activeButtonNumber - 1);
    initializeNewAccountSection();
})

// Обработчик ввода данных нового аккаунта.
$('form input').on("input", function () {
    updateValidityDisplay(this);
})




