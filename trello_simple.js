/**
 * Created by green on 2018-05-10.
 */

function render_agreements(board_id, locator, ignoreLists){
    if (!ignoreLists) ignoreLists = [];
    var card_url =  "https://trello.com/b/" + board_id + ".json";
    $.getJSON(card_url, function(trello_data) {
        var board = {
            lists: []
        };
        board.name = trello_data.name;
        trello_data.lists.forEach(function(list){
            // don't add ignored lists to the index
            console.log(list)
            if (ignoreLists.indexOf(list.id) == -1 && ignoreLists.indexOf(list.name)==-1 && !list.closed) {
                board.lists.push(list.id);
            }
            board[list.id] = {name: list.name, id: list.id, cards: []}
        });
        trello_data.cards.forEach(function(card){
          if (!card.closed) {
              board[card.idList]["cards"].push({
                  id: card.id,
                  name: card.name,
                  desc: card.desc,
                  labels: card.labels,
                  attachments: card.attachments
              })
          };
        });
        $("<H1>" + board.name + "</H1>").appendTo(locator);
        board.lists.forEach(function(listId){
            render_list(board[listId],locator);
        });
    });
}

function render_list(list, locator) {
    $("<div />", { id: list.id+"-wrap", "class": "list-wrap" }).appendTo(locator);
    $("#"+list.id+"-wrap").append("<h2 class>"+list.name+"</h2>");
    $("<div />", { id: list.id+"-cards", "class": "list-cards" }).appendTo("#"+list.id+"-wrap");
    list.cards.forEach(function(card){
        render_card(card, "#"+list.id+"-cards");
    });
}

function render_card(card, locator) {
    var converter = new showdown.Converter();
    // hide names prefixed with "--"
    var name = '<h3 class="name">'+ card.name +'</h3>';
    if (card.name.substring(0,2) == "--") name = ''; 
    var html = '<div class="card-content">'+ name +'<div class="desc">'+ converter.makeHtml(card.desc) +'</pre></div></div>';

    // render labels
    card.labels.forEach(function(label){
        html = "<div style='border-color:"+label.color+"' class='label label-"+label.color.replace(/\W/g,"-")+"'>"+html+"</div>";

    });

    html = '<div class="card">' + html + '<div>';
    $(locator).append(html);
}
