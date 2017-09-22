~/llvm/build/bin/clang -emit-llvm --target=wasm32 vlq.c -c -Os -o vlq.bc
~/llvm/build/bin/clang test.c vlq.c -o test_vlq
~/llvm/build/bin/llc -asm-verbose=false -o vlq.s vlq.bc
~/binaryen/bin/s2wasm -o vlq.wast vlq.s
~/binaryen/bin/wasm-opt -Oz vlq.wast -o vlq.wasm

./test_vlq m766qH
./test_vlq lth4ypC
