(module
 (table 0 anyfunc)
 (memory $0 1)
 (data (i32.const 16) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00>\00\00\00?456789:;<=\00\00\00\00\00\00\00\00\01\02\03\04\05\06\07\08\t\n\0b\0c\0d\0e\0f\10\11\12\13\14\15\16\17\18\19\00\00\00\00\00\00\1a\1b\1c\1d\1e\1f !\"#$%&\'()*+,-./0123\00\00\00\00")
 (export "memory" (memory $0))
 (export "decodeVLQ" (func $decodeVLQ))
 (func $decodeVLQ (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (set_local $4
   (i32.const 0)
  )
  (set_local $5
   (i32.const 0)
  )
  (set_local $6
   (i32.const 0)
  )
  (block $label$0
   (loop $label$1
    (set_local $3
     (i32.and
      (tee_local $1
       (i32.load8_u
        (i32.add
         (i32.and
          (i32.load8_u
           (get_local $0)
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
    (set_local $2
     (i32.and
      (get_local $1)
      (i32.const 32)
     )
    )
    (block $label$2
     (block $label$3
      (br_if $label$3
       (i32.eqz
        (get_local $5)
       )
      )
      (set_local $4
       (i32.or
        (i32.shl
         (get_local $3)
         (get_local $5)
        )
        (get_local $4)
       )
      )
      (set_local $5
       (i32.add
        (get_local $5)
        (i32.const 5)
       )
      )
      (br_if $label$2
       (get_local $2)
      )
      (br $label$0)
     )
     (set_local $4
      (i32.shr_u
       (get_local $3)
       (i32.const 1)
      )
     )
     (set_local $6
      (i32.and
       (get_local $1)
       (i32.const 1)
      )
     )
     (set_local $5
      (i32.const 4)
     )
     (br_if $label$0
      (i32.eqz
       (get_local $2)
      )
     )
    )
    (set_local $0
     (i32.add
      (get_local $0)
      (i32.const 1)
     )
    )
    (br_if $label$1
     (i32.lt_s
      (get_local $5)
      (i32.const 30)
     )
    )
   )
  )
  (select
   (i32.sub
    (i32.const 0)
    (get_local $4)
   )
   (get_local $4)
   (i32.and
    (get_local $6)
    (i32.const 1)
   )
  )
 )
)
