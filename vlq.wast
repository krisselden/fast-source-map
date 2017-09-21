(module
 (type $FUNCSIG$vi (func (param i32)))
 (type $FUNCSIG$viiii (func (param i32 i32 i32 i32)))
 (type $FUNCSIG$viiiii (func (param i32 i32 i32 i32 i32)))
 (type $FUNCSIG$v (func))
 (import "env" "emitMapping1" (func $emitMapping1 (param i32)))
 (import "env" "emitMapping4" (func $emitMapping4 (param i32 i32 i32 i32)))
 (import "env" "emitMapping5" (func $emitMapping5 (param i32 i32 i32 i32 i32)))
 (import "env" "emitNewline" (func $emitNewline))
 (table 0 anyfunc)
 (memory $0 1)
 (data (i32.const 16) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00>\00\00\00?456789:;<=\00\00\00\00\00\00\00\00\01\02\03\04\05\06\07\08\t\n\0b\0c\0d\0e\0f\10\11\12\13\14\15\16\17\18\19\00\00\00\00\00\00\1a\1b\1c\1d\1e\1f !\"#$%&\'()*+,-./0123\00\00\00\00")
 (export "memory" (memory $0))
 (export "decodeVLQ" (func $decodeVLQ))
 (export "emitMapping" (func $emitMapping))
 (export "decode" (func $decode))
 (func $decodeVLQ (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (set_local $5
   (i32.load
    (get_local $0)
   )
  )
  (set_local $1
   (i32.load offset=4
    (get_local $0)
   )
  )
  (set_local $6
   (i32.const 0)
  )
  (set_local $7
   (i32.const 0)
  )
  (set_local $8
   (i32.const 0)
  )
  (block $label$0
   (loop $label$1
    (i32.store
     (get_local $0)
     (tee_local $2
      (i32.add
       (get_local $5)
       (i32.const 1)
      )
     )
    )
    (set_local $4
     (i32.and
      (tee_local $5
       (i32.load8_u
        (i32.add
         (i32.and
          (i32.load8_u
           (i32.add
            (get_local $1)
            (get_local $5)
           )
          )
          (i32.const 127)
         )
         (i32.const 16)
        )
       )
      )
      (i32.const 31)
     )
    )
    (set_local $3
     (i32.and
      (get_local $5)
      (i32.const 32)
     )
    )
    (block $label$2
     (block $label$3
      (br_if $label$3
       (i32.eqz
        (get_local $7)
       )
      )
      (set_local $6
       (i32.or
        (i32.shl
         (get_local $4)
         (get_local $7)
        )
        (get_local $6)
       )
      )
      (set_local $7
       (i32.add
        (get_local $7)
        (i32.const 5)
       )
      )
      (br_if $label$2
       (get_local $3)
      )
      (br $label$0)
     )
     (set_local $6
      (i32.shr_u
       (get_local $4)
       (i32.const 1)
      )
     )
     (set_local $8
      (i32.and
       (get_local $5)
       (i32.const 1)
      )
     )
     (set_local $7
      (i32.const 4)
     )
     (br_if $label$0
      (i32.eqz
       (get_local $3)
      )
     )
    )
    (set_local $5
     (get_local $2)
    )
    (br_if $label$1
     (i32.lt_s
      (get_local $7)
      (i32.const 30)
     )
    )
   )
  )
  (select
   (i32.sub
    (i32.const 0)
    (get_local $6)
   )
   (get_local $6)
   (get_local $8)
  )
 )
 (func $emitMapping (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32)
  (block $label$0
   (block $label$1
    (block $label$2
     (br_if $label$2
      (i32.eq
       (get_local $0)
       (i32.const 5)
      )
     )
     (br_if $label$0
      (i32.eq
       (get_local $0)
       (i32.const 4)
      )
     )
     (br_if $label$1
      (i32.ne
       (get_local $0)
       (i32.const 1)
      )
     )
     (call $emitMapping1
      (get_local $1)
     )
     (return)
    )
    (call $emitMapping5
     (get_local $1)
     (get_local $2)
     (get_local $3)
     (get_local $4)
     (get_local $5)
    )
   )
   (return)
  )
  (call $emitMapping4
   (get_local $1)
   (get_local $2)
   (get_local $3)
   (get_local $4)
  )
 )
 (func $decode (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (set_local $4
   (i32.const 0)
  )
  (set_local $3
   (i32.add
    (get_local $0)
    (i32.const 4)
   )
  )
  (set_local $5
   (i32.const 0)
  )
  (set_local $6
   (i32.const 0)
  )
  (set_local $7
   (i32.const 0)
  )
  (set_local $8
   (i32.const 0)
  )
  (set_local $9
   (i32.const 0)
  )
  (loop $label$0
   (block $label$1
    (br_if $label$1
     (i32.ne
      (tee_local $2
       (i32.load8_u
        (i32.add
         (i32.load
          (get_local $3)
         )
         (i32.load
          (get_local $0)
         )
        )
       )
      )
      (i32.const 44)
     )
    )
    (call $emitMapping
     (get_local $4)
     (get_local $5)
     (get_local $6)
     (get_local $7)
     (get_local $8)
     (get_local $9)
    )
    (i32.store
     (get_local $0)
     (i32.add
      (i32.load
       (get_local $0)
      )
      (i32.const 1)
     )
    )
    (set_local $4
     (i32.const 0)
    )
    (br $label$0)
   )
   (block $label$2
    (br_if $label$2
     (i32.ne
      (get_local $2)
      (i32.const 59)
     )
    )
    (block $label$3
     (br_if $label$3
      (i32.eqz
       (get_local $4)
      )
     )
     (call $emitMapping
      (get_local $4)
      (get_local $5)
      (get_local $6)
      (get_local $7)
      (get_local $8)
      (get_local $9)
     )
    )
    (call $emitNewline)
    (i32.store
     (get_local $0)
     (i32.add
      (i32.load
       (get_local $0)
      )
      (i32.const 1)
     )
    )
    (set_local $4
     (i32.const 0)
    )
    (set_local $5
     (i32.const 0)
    )
    (br $label$0)
   )
   (block $label$4
    (br_if $label$4
     (i32.eqz
      (get_local $2)
     )
    )
    (set_local $1
     (call $decodeVLQ
      (get_local $0)
     )
    )
    (br_if $label$0
     (i32.gt_u
      (tee_local $2
       (i32.and
        (get_local $4)
        (i32.const 7)
       )
      )
      (i32.const 4)
     )
    )
    (block $label$5
     (block $label$6
      (block $label$7
       (block $label$8
        (block $label$9
         (br_table $label$9 $label$8 $label$7 $label$6 $label$5 $label$9
          (get_local $2)
         )
        )
        (set_local $5
         (i32.add
          (get_local $1)
          (get_local $5)
         )
        )
        (set_local $4
         (i32.const 1)
        )
        (br $label$0)
       )
       (set_local $6
        (i32.add
         (get_local $1)
         (get_local $6)
        )
       )
       (set_local $4
        (i32.const 2)
       )
       (br $label$0)
      )
      (set_local $7
       (i32.add
        (get_local $1)
        (get_local $7)
       )
      )
      (set_local $4
       (i32.const 3)
      )
      (br $label$0)
     )
     (set_local $8
      (i32.add
       (get_local $1)
       (get_local $8)
      )
     )
     (set_local $4
      (i32.const 4)
     )
     (br $label$0)
    )
    (set_local $9
     (i32.add
      (get_local $1)
      (get_local $9)
     )
    )
    (set_local $4
     (i32.const 5)
    )
    (br $label$0)
   )
  )
  (block $label$10
   (br_if $label$10
    (i32.eqz
     (get_local $4)
    )
   )
   (call $emitMapping
    (get_local $4)
    (get_local $5)
    (get_local $6)
    (get_local $7)
    (get_local $8)
    (get_local $9)
   )
  )
 )
)
