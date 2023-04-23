#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/select.h>

int main() {
    FILE* read_fp;
    char buffer[BUFSIZ + 1];
    int chars_read;

    memset(buffer, '\0', sizeof(buffer));

    read_fp = popen("roscore", "r");

    if(read_fp != NULL) {
        chars_read = fread(buffer, sizeof(char), BUFSIZ, read_fp);
        if(chars_read > 0)
        {
            printf("YO!");
        }

        pclose(read_fp);
        exit(EXIT_SUCCESS);
    }

    exit(EXIT_FAILURE);
}