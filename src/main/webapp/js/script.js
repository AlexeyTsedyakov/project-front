// Получаем данные игроков.
$(document).ready(() => {
    updatePlayersList(0)
    updatePageButtons()
})

// Отображаем список игроков.
function updatePlayersList(pageNumber) {
    let pageSize = getPageSize()
    let url = '/rest/players?' + 'pageNumber=' + pageNumber + '&pageSize=' + pageSize
    $.get(url, (data) => {
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            let user = '<tr>'

            // Перебираем id колонок и используем их как ключи для получения значения в загруженном объекте.
            $("#playersData thead tr th").each(function () {
                let key = $(this).attr('id');
                let value= key === 'birthday' ? new Date(data[i][key]).toLocaleDateString("en-US") : data[i][key]
                user += '<td>' + value + '</td>'
            })

            user += '</tr>'
            $('#playersData tbody').append(user)
        }
    })
}

// Получаем количество аккаунтов.
function getPlayersCount() {
    let playersData
    $.ajax({
        url: "/rest/players/count",
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(data) {
            playersData = data;
        }
    })
    return playersData;
}

// Получаем количество отображаемых страниц.
function getPageCount() {
    const playersCount = getPlayersCount();
    const pageSize = getPageSize
    return Math.ceil(playersCount / pageSize)
}

function updatePageButtons() {
    $('.pageButton').remove()

    let pageCount = getPageCount()
    for (let i = 1; i <= pageCount; i++) {
        $('#pageButtons').append('<button class="pageButton">' + i + '</button>')
    }
}

function getPageSize() {
    return $('#countPerPage').val()
}

// Обработчик изменений countPerPage.
$('#countPerPage').change(function(){
    let value =$(this).val()
    updatePageButtons()
    updatePlayersList(0)
})

