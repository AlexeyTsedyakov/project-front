const countPerPage = $('#countPerPage')
var activeButtonNumber;

function getPageSize() {
    return countPerPage.val()
}

function getPlayersCount() {
    let playersData
    $.ajax({
        url: "/rest/players/count",
        type: 'get',
        dataType: 'html',
        async: false,
        success: function (data) {
            playersData = data;
        }
    })
    return playersData;
}

function getPageCount() {
    const playersCount = getPlayersCount()
    const pageSize = getPageSize()
    return Math.ceil(playersCount / pageSize)
}

function updatePlayersList(pageNumber) {
    let pageSize = getPageSize()
    let url = '/rest/players?' + $.param({
        "pageNumber": pageNumber,
        "pageSize": pageSize
    })
    $.get(url, (data) => {
        // Очищаем строки в таблице.
        $('#playersData tbody tr').remove()

        // Формируем новые строки.
        for (let i = 0; i < data.length; i++) {
            let user = '<tr>'

            // Перебираем id колонок и используем их как ключи для получения значения в загруженном объекте.
            $("#playersData thead tr th").each(function () {
                let key = $(this).attr('class');
                if (key === 'edit') {
                    user += '<td class="editAccount"><img class="img" src="/img/edit.png" alt="edit.png"></td>'
                } else if (key === 'delete') {
                    user += '<td class="deleteAccount"><img class="img" src="/img/delete.png" alt="delete.png"></td>'
                } else if (key === 'birthday') {
                    let value = new Date(data[i][key]).toLocaleDateString("en-US")
                    user += '<td class="' + key + '">' + value + '</td>'
                } else {
                    let value = data[i][key]
                    user += '<td class="' + key + '">' + value + '</td>'
                }
            })

            user += '</tr>'
            $('#playersData tbody').append(user)
        }
    })
}

function updatePageButtons() {
    $('.pageButton').remove()

    let pageCount = getPageCount()
    for (let i = 1; i <= pageCount; i++) {
        let id = 'button' + i
        $('#pageButtons').append('<button id="' + id + '" class="pageButton">' + i + '</button>')
    }

    setActiveButton(1)
}

function setActiveButton(buttonNumber) {
    $('.pageButton, .active').removeClass('active')
    const id = 'button' + buttonNumber
    $('#' + id).addClass('active')
    activeButtonNumber = buttonNumber
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
                alert(`(id ${id}) ${msg}`);
            }
        }
    });
}

function addInputInCell(cell) {
    if ($(cell).hasClass('race')) {
        addRaceSelect(cell)
    } else if ($(cell).hasClass('profession')) {
        addProfessionSelect(cell);
    } else if ($(cell).hasClass('banned')) {
        addBanSelect(cell)
    } else {
        addTextInput(cell)
    }
}

function addTextInput(cell) {
    const value = cell.text()
    cell.text('')
    cell.append('<input value="' + value + '"/>')
}

function addRaceSelect(cell) {
    const value = cell.text()
    cell.text('')

    let select = ''
    select += '<select class="raceSelect">'
    select += '<option value="HUMAN">HUMAN</option>'
    select += '<option value="DWARF">DWARF</option>'
    select += '<option value="ELF">ELF</option>'
    select += '<option value="GIANT">GIANT</option>'
    select += '<option value="ORC">ORC</option>'
    select += '<option value="TROLL">TROLL</option>'
    select += '<option value="HOBBIT">HOBBIT</option>'
    select += '</select>'

    cell.append(select)
    $(cell).find('.raceSelect').val(value)
}

function addProfessionSelect(cell) {
    const value = cell.text()
    cell.text('')

    let select = ''
    select += '<select class="professionSelect">'
    select += '<option value="WARRIOR">WARRIOR</option>'
    select += '<option value="ROGUE">ROGUE</option>'
    select += '<option value="SORCERER">SORCERER</option>'
    select += '<option value="CLERIC">CLERIC</option>'
    select += '<option value="PALADIN">PALADIN</option>'
    select += '<option value="NAZGUL">NAZGUL</option>'
    select += '<option value="WARLOCK">WARLOCK</option>'
    select += '</select>'

    cell.append(select)
    $(cell).find('.professionSelect').val(value)
}

function addBanSelect(cell) {
    const value = cell.text()
    cell.text('')

    let select = ''
    select += '<select class="banSelect">'
    select += '<option value="true">true</option>'
    select += '<option value="false">false</option>'
    select += '</select>'

    cell.append(select)
    $(cell).find('.banSelect').val(value)
}

// Обработчик при загрузке документа.
$(document).ready(() => {
    updatePlayersList(0)
    updatePageButtons()
})

// Обработчик изменений countPerPage.
countPerPage.change(function () {
    updatePlayersList(0)
    updatePageButtons()
})

// Обработчик нажатия кнопок страниц.
$(document).on('click', '.pageButton', function () {
    const button = $(this)
    const pageNumber = button.text()
    updatePlayersList(pageNumber - 1)
    setActiveButton(pageNumber)
})

// Обработчик удаления аккаунта.
$(document).on('click', '.deleteAccount', function () {
    const row = $(this).parent()
    const id = row.find('.id').text()
    deleteAccount(id)
    updatePlayersList(activeButtonNumber - 1)
})

// Обработчик редактирования аккаунта.
$(document).on('click', '.editAccount', function () {
    const row = $(this).parent()

    const nameCell = $(row).find('.name')
    addInputInCell(nameCell)

    const titleCell = $(row).find('.title')
    addInputInCell(titleCell)

    const raceCell = $(row).find('.race')
    addInputInCell(raceCell)

    const professionCell = $(row).find('.profession')
    addInputInCell(professionCell)

    const bannedCell = $(row).find('.banned')
    addInputInCell(bannedCell)

    const editCell = $(row).find('.editAccount')
    editCell.removeClass('editAccount')
    editCell.addClass('saveAccount')
    editCell.find('.img').attr('src', '/img/save.png')

    const deleteCell = $(row).find('.deleteAccount')
    deleteCell.removeClass('deleteAccount')
    deleteCell.find('.img').css('display', 'none')
})

// Обработчик сохранения аккаунта.
$(document).on('click', '.saveAccount', function () {
    $('#playersData tbody .saveAccount').each(function() {
        const row = $(this).parent()
        const id = row.find('.id').text()
        const dataParams = {
            name: row.find('.name [value]').val(),
            title: row.find('.title [value]').val(),
            race: row.find('.raceSelect').val(),
            profession: row.find('.professionSelect').val(),
            banned: row.find('.banSelect').val()
        }
        updatePlayerData(dataParams, id)
    })
    updatePlayersList(activeButtonNumber - 1)
})

