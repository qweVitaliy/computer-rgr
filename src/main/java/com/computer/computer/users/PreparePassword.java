package com.computer.computer.users;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class PreparePassword {

    public static String encode(String raw) {
        return Base64.getEncoder()
                .encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    public static String decode(String encoded) {
        return new String(
                Base64.getDecoder().decode(encoded),
                StandardCharsets.UTF_8
        );
    }
}
