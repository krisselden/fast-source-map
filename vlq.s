	.text
	.file	"vlq.c"
	.hidden	decodeVLQ
	.globl	decodeVLQ
	.type	decodeVLQ,@function
decodeVLQ:
	.param  	i32
	.result 	i32
	.local  	i32, i32, i32, i32, i32, i32
	i32.const	$4=, 0
	i32.const	$5=, 0
	i32.const	$6=, 0
.LBB0_1:
	block   	
	loop    	
	i32.load8_u	$push1=, 0($0)
	i32.const	$push16=, 127
	i32.and 	$push2=, $pop1, $pop16
	i32.const	$push15=, asciiToUint6
	i32.add 	$push3=, $pop2, $pop15
	i32.load8_u	$push14=, 0($pop3)
	tee_local	$push13=, $1=, $pop14
	i32.const	$push12=, 31
	i32.and 	$3=, $pop13, $pop12
	i32.const	$push11=, 32
	i32.and 	$2=, $1, $pop11
	block   	
	block   	
	i32.eqz 	$push22=, $5
	br_if   	0, $pop22
	i32.shl 	$push4=, $3, $5
	i32.or  	$4=, $pop4, $4
	i32.const	$push17=, 5
	i32.add 	$push0=, $5, $pop17
	copy_local	$5=, $pop0
	br_if   	1, $2
	br      	3
.LBB0_3:
	end_block
	i32.const	$push19=, 1
	i32.shr_u	$4=, $3, $pop19
	i32.const	$push18=, 1
	i32.and 	$6=, $1, $pop18
	i32.const	$5=, 4
	i32.eqz 	$push23=, $2
	br_if   	2, $pop23
.LBB0_4:
	end_block
	i32.const	$push21=, 1
	i32.add 	$0=, $0, $pop21
	i32.const	$push20=, 30
	i32.lt_s	$push5=, $5, $pop20
	br_if   	0, $pop5
.LBB0_5:
	end_loop
	end_block
	i32.const	$push8=, 0
	i32.sub 	$push9=, $pop8, $4
	i32.const	$push6=, 1
	i32.and 	$push7=, $6, $pop6
	i32.select	$push10=, $pop9, $4, $pop7
	.endfunc
.Lfunc_end0:
	.size	decodeVLQ, .Lfunc_end0-decodeVLQ

	.hidden	asciiToUint6
	.type	asciiToUint6,@object
	.data
	.globl	asciiToUint6
	.p2align	4
asciiToUint6:
	.asciz	"\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000>\000\000\000?456789:;<=\000\000\000\000\000\000\000\000\001\002\003\004\005\006\007\b\t\n\013\f\r\016\017\020\021\022\023\024\025\026\027\030\031\000\000\000\000\000\000\032\033\034\035\036\037 !\"#$%&'()*+,-./0123\000\000\000"
	.size	asciiToUint6, 127


	.ident	"clang version 6.0.0 (trunk 313852)"
