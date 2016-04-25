/**

This module handles paying

**/
window.faktura=(function(){
	//private

	function addNew(){
		prompt.start({
			title: 'Legg til ny faktura',
			formContent: $('.formContent').html(),
			submitButton: 'Legg til'
		}, function(result){
			if(result){
				popup.loading('Autentiserer');
				var invoice = {};
				console.log(result);
				$(result).each(function(i, x) {
					invoice[x.name] = x.value;
				})
				console.log(invoice.date)
				invoice.date = moment(invoice.date, 'DD/MM/YYYY').format("YYYY-MM-DD");
				invoice.tripDate = moment(invoice.tripDate, 'DD/MM/YYYY').format("YYYY-MM-DD");
				invoice.amount = parseInt(invoice.amount);

				console.log(invoice);

				$.post('/admin/invoice/addInvoice', {invoice:invoice})
				.fail(function(err){
					popup.error('Det skjedde et error: ' + JSON.stringify(err));
				})
				.success(function(result){
					console.log(result);
					popup.finished();
					location.reload();
				})

			}
		})

		$('.datetimepicker').datetimepicker({
			format: 'DD/MM/YYYY',
			icons: {
				previous: 'fa fa-chevron-left',
				next: 'fa fa-chevron-right'
			}
		});

		$('.today').val(moment().format('DD/MM/YYYY'));
	}

	//public:
	return{
		init:function(){
			$('button#add').click(addNew);

			$('td.date').each(function(){
				$(this).html(moment(this.innerHTML).format('DD-MM-YYYY'))
			})

			$('td.tripDate').each(function(){
				$(this).html(moment(this.innerHTML).format('DD/MM'))
			})



			$('td.paid').each(function(){
				var betalt;
				if($(this).html() == "true"){
					betalt = 'Ja';
					$(this).addClass('ispaid');
				}else{
					betalt = 'Nei';
					$(this).addClass('isunpaid');
				}
				$(this).html(betalt)
			})

			$('td.description').each(function(){
				var length = 14;

				var string = $(this).html();

				if(string.length > length){
					string = string.substring(0, length) + '...';
				}

				$(this).html(string);
			})

			$('td.amount').each(function(){
				var string = $(this).html();
				var length = string.length;

				$(this).html(string.substring(0,length-3) + ' kr');
			})

		}
	}

}());

faktura.init();
