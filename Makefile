CC      ?= cc
CFLAGS  ?= -O2 -g
CFLAGS  += -std=c17 -D_POSIX_C_SOURCE=200809L -Wall -Wextra -Wpedantic -Wshadow -Wstrict-prototypes -Wvla
OBJS     = forge/forge.o forge/md.o forge/ini.o forge/util.o

all: site

forge/forge: $(OBJS)
	$(CC) $(CFLAGS) -o $@ $(OBJS) $(LDFLAGS)

$(OBJS): forge/forge.h

site: forge/forge
	rm -rf out
	./forge/forge content templates out
	cp -r static/. out/

# Sanitizer build in its own binary, so it never ends up in a normal build.
# Leak checking is off: forge keeps its content until exit on purpose.
debug:
	$(CC) -std=c17 -D_POSIX_C_SOURCE=200809L -Wall -Wextra -O0 -g \
		-fsanitize=address,undefined -fno-omit-frame-pointer -o forge/forge-asan forge/*.c
	ASAN_OPTIONS=detect_leaks=0 UBSAN_OPTIONS=halt_on_error=1 ./forge/forge-asan content templates out-asan

serve: site
	cd out && python3 -m http.server 8080

clean:
	rm -rf out out-asan forge/forge forge/forge-asan $(OBJS)

.PHONY: all site debug serve clean
