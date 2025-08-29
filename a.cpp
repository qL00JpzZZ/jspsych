#include <iostream>
#include <filesystem>
#include <string>
#include <algorithm> // この行を追加
#include <cctype>    // std::tolowerを使用するためにこの行を追加

namespace fs = std::filesystem;

// 指定されたフォルダ内のJPGファイル名を再帰的に列挙する関数
void listJpgFiles(const fs::path& folderPath) {
    try {
        // ディレクトリ内のすべてのエントリ（ファイルとフォルダ）を反復処理
        for (const auto& entry : fs::recursive_directory_iterator(folderPath)) {
            // エントリが通常ファイルであり、かつ拡張子が.jpgまたは.JPGであるかを確認
            if (fs::is_regular_file(entry.status())) {
                std::string fileName = entry.path().filename().string();
                
                // ファイル名から拡張子の後ろにある余分な文字列を削除
                size_t colonPos = fileName.find(':');
                if (colonPos != std::string::npos) {
                    fileName = fileName.substr(0, colonPos);
                }

                // 小文字に変換して拡張子が.jpgかどうかをチェック
                std::string extension = fileName.substr(fileName.find_last_of('.') + 1);
                std::transform(extension.begin(), extension.end(), extension.begin(),
                               [](unsigned char c){ return std::tolower(c); });

                if (extension == "jpg") {
                    std::cout << fileName << std::endl;
                }
            }
        }
    } catch (const fs::filesystem_error& ex) {
        std::cerr << "Filesystem error: " << ex.what() << std::endl;
    }
}

int main() {
    // フォルダのパスを指定
    fs::path rootPath = "/home/sho/experiment/scenes";
    
    // 関数を呼び出してファイル名を列挙
    listJpgFiles(rootPath);

    return 0;
}