package com.somika.imagefileservice.util;

import org.springframework.stereotype.Service;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.HashMap;
import java.util.Map;

@Service
public class DominantColorExtractor {

    public enum DominantColor {
        RED, GREEN, BLUE, OTHER
    }

    public String determineHexColorValue(BufferedImage image) {
        Map<Integer, Integer> colorCount = new HashMap<>();

        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                Color color = new Color(image.getRGB(x, y));

                int rgb = color.getRGB();

                colorCount.put(rgb, colorCount.getOrDefault(rgb, 0) + 1);
            }
        }

        int maxCount = 0;
        int dominantColorRGB = 0;
        for (Map.Entry<Integer, Integer> entry : colorCount.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                dominantColorRGB = entry.getKey();
            }
        }

        return String.format("#%06X", dominantColorRGB & 0xFFFFFF);
    }

    public DominantColor determineDominantColor(BufferedImage image) {
        int totalPixels = image.getWidth() * image.getHeight();

        int totalRed = 0;
        int totalGreen = 0;
        int totalBlue = 0;

        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                Color color = new Color(image.getRGB(x, y));
                totalRed += color.getRed();
                totalGreen += color.getGreen();
                totalBlue += color.getBlue();
            }
        }

        int avgRed = totalRed / totalPixels;
        int avgGreen = totalGreen / totalPixels;
        int avgBlue = totalBlue / totalPixels;
        Color avgColor = new Color(avgRed, avgGreen, avgBlue);

        return mapToDominantColor(avgColor);
    }

    private DominantColor mapToDominantColor(Color color) {
        int red = color.getRed();
        int green = color.getGreen();
        int blue = color.getBlue();

        if (red > green && red > blue) {
            return DominantColor.RED;
        } else if (green > red && green > blue) {
            return DominantColor.GREEN;
        } else if (blue > red && blue > green) {
            return DominantColor.BLUE;
        } else {
            return DominantColor.OTHER;
        }
    }

}
