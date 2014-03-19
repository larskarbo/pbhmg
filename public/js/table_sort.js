function TableSort(opts)
{
    var self = this;

    this.options =
    {
        table: null,
        rowClass: null,
        sortFields: []
    }
    
    for(var key in opts)
    {
        this.options[key] = opts[key];
    }
    
    if(!this.options.table || !this.options.rowClass || this.options.sortFields.length == 0)
    {
        return;
    }
    
    this.sortField = function(event)
    {
        var header = '#' + event.currentTarget.id;
        
        for(var i = 0; i < self.options.sortFields.length; i++)
        {
            if(self.options.sortFields[i].header == header)
            {
                $('body').append('<table id="temp_sort_table" style="display:none"></table>');
                $('#temp_sort_table').append($(self.options.rowClass));
                
                self.getNextRow(self.options.sortFields[i]);
                
                return;
            }
        }
    }
    
    this.getNextRow = function(field)
    {
        var nextRow = null;
        var nextRowText = '';
        
        if($('#temp_sort_table ' + self.options.rowClass).length == 0)
        {
            return;
        }
        
        if(field.sortAsc)
        {
            var rowIndex = 0;
            
            $('#temp_sort_table ' + self.options.rowClass).each(function()
            {
                var row = $(this);
                row.find(field.textContainer).each(function()
                {
                    if(!nextRow)
                    {
                        nextRow = row;
                        nextRowText = $(this).html();
                    }
                    else
                    {
                        if($(this).html() < nextRowText)
                        {
                            nextRow = row;
                            nextRowText = $(this).html();
                        }
                    }
                });
                
                rowIndex++;
                if(rowIndex >= $('#temp_sort_table ' + self.options.rowClass).length)
                {
                    $(self.options.table).append(nextRow);
                    self.getNextRow(field);
                }
            });
        }
    }
    
    for(var i = 0; i < this.options.sortFields.length; i++)
    {
        this.options.sortFields[i].sortAsc = true;
    
        switch(this.options.sortFields[i].sortType)
        {
            case 'alpha':
                $(this.options.sortFields[i].header).append('&nbsp;<i class="fa fa-sort-alpha-asc"></i>');
                break;
            case 'number':
                $(this.options.sortFields[i].header).append('&nbsp;<i class="fa fa-sort-numeric-asc"></i>');
                break;
            default:
                $(this.options.sortFields[i].header).append('&nbsp;<i class="fa fa-sort-amount-asc"></i>');
                break;
        }
        
        $(this.options.sortFields[i].header).css({cursor: 'pointer'});
        $(this.options.sortFields[i].header).click(this.sortField);
    }
}
