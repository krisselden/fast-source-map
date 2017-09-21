	.text
	.file	"vlq.c"
	.hidden	decodeVLQ
	.globl	decodeVLQ
	.type	decodeVLQ,@function
decodeVLQ:
	.param  	i32
	.result 	i32
	.local  	i32, i32, i32, i32, i32, i32, i32, i32
	i32.load	$5=, 0($0)
	i32.load	$1=, 4($0)
	i32.const	$6=, 0
	i32.const	$7=, 0
	i32.const	$8=, 0
.LBB0_1:
	block   	
	loop    	
	i32.const	$push18=, 1
	i32.add 	$push17=, $5, $pop18
	tee_local	$push16=, $2=, $pop17
	i32.store	0($0), $pop16
	i32.add 	$push1=, $1, $5
	i32.load8_u	$push2=, 0($pop1)
	i32.const	$push15=, 127
	i32.and 	$push3=, $pop2, $pop15
	i32.const	$push14=, asciiToUint6
	i32.add 	$push4=, $pop3, $pop14
	i32.load8_u	$push13=, 0($pop4)
	tee_local	$push12=, $5=, $pop13
	i32.const	$push11=, 31
	i32.and 	$4=, $pop12, $pop11
	i32.const	$push10=, 32
	i32.and 	$3=, $5, $pop10
	block   	
	block   	
	i32.eqz 	$push23=, $7
	br_if   	0, $pop23
	i32.shl 	$push5=, $4, $7
	i32.or  	$6=, $pop5, $6
	i32.const	$push19=, 5
	i32.add 	$push0=, $7, $pop19
	copy_local	$7=, $pop0
	br_if   	1, $3
	br      	3
.LBB0_3:
	end_block
	i32.const	$push21=, 1
	i32.shr_u	$6=, $4, $pop21
	i32.const	$push20=, 1
	i32.and 	$8=, $5, $pop20
	i32.const	$7=, 4
	i32.eqz 	$push24=, $3
	br_if   	2, $pop24
.LBB0_4:
	end_block
	copy_local	$5=, $2
	i32.const	$push22=, 30
	i32.lt_s	$push6=, $7, $pop22
	br_if   	0, $pop6
.LBB0_5:
	end_loop
	end_block
	i32.const	$push7=, 0
	i32.sub 	$push8=, $pop7, $6
	i32.select	$push9=, $pop8, $6, $8
	.endfunc
.Lfunc_end0:
	.size	decodeVLQ, .Lfunc_end0-decodeVLQ

	.hidden	emitMapping
	.globl	emitMapping
	.type	emitMapping,@function
emitMapping:
	.param  	i32, i32, i32, i32, i32, i32
	block   	
	block   	
	block   	
	i32.const	$push0=, 5
	i32.eq  	$push1=, $0, $pop0
	br_if   	0, $pop1
	i32.const	$push2=, 4
	i32.eq  	$push3=, $0, $pop2
	br_if   	2, $pop3
	i32.const	$push4=, 1
	i32.ne  	$push5=, $0, $pop4
	br_if   	1, $pop5
	call    	emitMapping1@FUNCTION, $1
	return
.LBB1_4:
	end_block
	call    	emitMapping5@FUNCTION, $1, $2, $3, $4, $5
.LBB1_5:
	end_block
	return
.LBB1_6:
	end_block
	call    	emitMapping4@FUNCTION, $1, $2, $3, $4
	.endfunc
.Lfunc_end1:
	.size	emitMapping, .Lfunc_end1-emitMapping

	.hidden	decode
	.globl	decode
	.type	decode,@function
decode:
	.param  	i32
	.local  	i32, i32, i32, i32, i32, i32, i32, i32, i32
	i32.const	$4=, 0
	i32.const	$push10=, 4
	i32.add 	$3=, $0, $pop10
	i32.const	$5=, 0
	i32.const	$6=, 0
	i32.const	$7=, 0
	i32.const	$8=, 0
	i32.const	$9=, 0
.LBB2_1:
	loop    	
	block   	
	i32.load	$push0=, 0($3)
	i32.load	$push1=, 0($0)
	i32.add 	$push2=, $pop0, $pop1
	i32.load8_u	$push19=, 0($pop2)
	tee_local	$push18=, $2=, $pop19
	i32.const	$push17=, 44
	i32.ne  	$push3=, $pop18, $pop17
	br_if   	0, $pop3
	call    	emitMapping@FUNCTION, $4, $5, $6, $7, $8, $9
	i32.load	$push5=, 0($0)
	i32.const	$push15=, 1
	i32.add 	$push6=, $pop5, $pop15
	i32.store	0($0), $pop6
	i32.const	$4=, 0
	br      	1
.LBB2_3:
	end_block
	block   	
	i32.const	$push20=, 59
	i32.ne  	$push4=, $2, $pop20
	br_if   	0, $pop4
	block   	
	i32.eqz 	$push21=, $4
	br_if   	0, $pop21
	call    	emitMapping@FUNCTION, $4, $5, $6, $7, $8, $9
.LBB2_6:
	end_block
	call    	emitNewline@FUNCTION
	i32.load	$push7=, 0($0)
	i32.const	$push16=, 1
	i32.add 	$push8=, $pop7, $pop16
	i32.store	0($0), $pop8
	i32.const	$4=, 0
	i32.const	$5=, 0
	br      	1
.LBB2_7:
	end_block
	block   	
	i32.eqz 	$push22=, $2
	br_if   	0, $pop22
	i32.call	$1=, decodeVLQ@FUNCTION, $0
	i32.const	$push14=, 7
	i32.and 	$push13=, $4, $pop14
	tee_local	$push12=, $2=, $pop13
	i32.const	$push11=, 4
	i32.gt_u	$push9=, $pop12, $pop11
	br_if   	1, $pop9
	block   	
	block   	
	block   	
	block   	
	block   	
	br_table 	$2, 0, 1, 2, 3, 4, 0
.LBB2_10:
	end_block
	i32.add 	$5=, $1, $5
	i32.const	$4=, 1
	br      	5
.LBB2_11:
	end_block
	i32.add 	$6=, $1, $6
	i32.const	$4=, 2
	br      	4
.LBB2_12:
	end_block
	i32.add 	$7=, $1, $7
	i32.const	$4=, 3
	br      	3
.LBB2_13:
	end_block
	i32.add 	$8=, $1, $8
	i32.const	$4=, 4
	br      	2
.LBB2_14:
	end_block
	i32.add 	$9=, $1, $9
	i32.const	$4=, 5
	br      	1
.LBB2_15:
	end_block
	end_loop
	block   	
	i32.eqz 	$push23=, $4
	br_if   	0, $pop23
	call    	emitMapping@FUNCTION, $4, $5, $6, $7, $8, $9
.LBB2_17:
	end_block
	.endfunc
.Lfunc_end2:
	.size	decode, .Lfunc_end2-decode

	.hidden	asciiToUint6
	.type	asciiToUint6,@object
	.data
	.globl	asciiToUint6
	.p2align	4
asciiToUint6:
	.asciz	"\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000>\000\000\000?456789:;<=\000\000\000\000\000\000\000\000\001\002\003\004\005\006\007\b\t\n\013\f\r\016\017\020\021\022\023\024\025\026\027\030\031\000\000\000\000\000\000\032\033\034\035\036\037 !\"#$%&'()*+,-./0123\000\000\000"
	.size	asciiToUint6, 127


	.ident	"clang version 6.0.0 (trunk 313852)"
	.functype	emitMapping1, void, i32
	.functype	emitMapping4, void, i32, i32, i32, i32
	.functype	emitMapping5, void, i32, i32, i32, i32, i32
	.functype	emitNewline, void
