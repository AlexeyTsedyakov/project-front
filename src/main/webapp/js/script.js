$(document).ready(() => {
    $.get("/rest/players", (data) => {
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            let user = '<tr>'

            // Перебираем id колонок и используем их как ключи для получения значения в загруженном объекте.
            $("#playersData thead tr th").each(function(){
                let key = $(this).attr('id');
                user += '<td>' + data[i][key] + '</td>'
            })

            user += '</tr>'
            $('#playersData tbody').append(user)
        }
    })
})


