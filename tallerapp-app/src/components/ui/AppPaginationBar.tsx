import React from "react";
import { View, Text, Pressable, StyleSheet, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

interface Props {
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function AppPaginationBar({ currentPage, lastPage, total, onPageChange }: Props) {
  const scheme = useColorScheme() ?? "dark";
  const colors = Colors[scheme];

  if (lastPage <= 1) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.info, { color: colors.subtitle }]}>
        Pagina {currentPage} de {lastPage} ({total} registros)
      </Text>
      <View style={styles.buttons}>
        <Pressable
          disabled={currentPage <= 1}
          onPress={() => onPageChange(currentPage - 1)}
          style={[styles.btn, { opacity: currentPage <= 1 ? 0.3 : 1 }]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>

        {generatePageNumbers(currentPage, lastPage).map((page, i) => (
          <Pressable
            key={i}
            onPress={() => typeof page === "number" && onPageChange(page)}
            style={[
              styles.pageBtn,
              page === currentPage && { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.pageText,
                { color: page === currentPage ? "#fff" : colors.text },
              ]}
            >
              {page}
            </Text>
          </Pressable>
        ))}

        <Pressable
          disabled={currentPage >= lastPage}
          onPress={() => onPageChange(currentPage + 1)}
          style={[styles.btn, { opacity: currentPage >= lastPage ? 0.3 : 1 }]}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

function generatePageNumbers(current: number, last: number): (number | "...")[] {
  if (last <= 5) return Array.from({ length: last }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < last - 2) pages.push("...");
  pages.push(last);
  return pages;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  info: {
    fontSize: 12,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  pageText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
