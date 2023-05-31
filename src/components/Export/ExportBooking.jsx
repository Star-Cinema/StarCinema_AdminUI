import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import * as FileSaver from 'file-saver';
import React from "react";
import {
    Button,
} from "antd";

export default function ExportBooking({ csvData, fileName, buttonName, headerFile }) {
    const createDownloadData = () => {
        handleExport().then((res) => {
            FileSaver.saveAs(res, fileName + ".xlsx")
        })
    }

    const workbook2blob = (workbook) => {
        const wopts = {
            bookType: "xlsx",
            bookSST: false,
            type: "binary",
        };

        const wbout = XLSX.write(workbook, wopts);

        const blob = new Blob([s2ab(wbout)], {
            type: "application/octet-stream",
        });

        return blob;
    };

    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i);
        }
        return buf;
    };

    const handleExport = () => {
        let table = headerFile
        table.splice(1)

        csvData.forEach((row) => {
            table.push({
                A: row.id,
                B: row.userName,
                C: row.filmName,
                D: row.status,
                E: row.totalPrice,
                F: row.createAt,
            })
        })

        // const title = [{}];
        const titlecontractSigningDate = [{ A: " ", B: " ", C: " ", D: " ", E: " ", F: " "}];
        table = []
            .concat(table).concat([""])
        const finalData = [...titlecontractSigningDate, ...table];

        const wb = XLSX.utils.book_new();
        const sheet = XLSX.utils.json_to_sheet(finalData, {
            skipHeader: true,
        });

        XLSX.utils.book_append_sheet(wb, sheet, fileName);

        const workbookBlob = workbook2blob(wb);

        var headerIndexes = [];
        finalData.forEach((csvData, index) =>
            csvData["A"] === headerFile.length[0] ? headerIndexes.push(index) : null
        );

        const dataInfo = {
            Id: "A2:A2",
            UserName: "B2:B2",
            FilmName: "C2:C2",
            Status: "D2:D2",
            TotalPrice: "E2:E2",
            CreateAt: "F2:F2",
        };
        return addStyle(workbookBlob, dataInfo);
    }
    const addStyle = (workbookBlob, dataInfo) => {
        return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
            workbook.sheets().forEach((sheet) => {
                sheet.usedRange().style({
                    fontFamily: "Times New Roman",
                    verticalAlignment: "center",
                });

                sheet.column("A").width(10).style({ horizontalAlignment: "right", });
                sheet.column("B").width(30).style({ horizontalAlignment: "right", });
                sheet.column("C").width(20).style({ horizontalAlignment: "right", });
                sheet.column("D").width(50).style({ horizontalAlignment: "right", });
                sheet.column("E").width(30).style({ horizontalAlignment: "right", });
                sheet.column("F").width(30).style({ horizontalAlignment: "right", });

                sheet.range(dataInfo.Id).merged(false).style({
                    fill: "BCEAD5",
                    bold: true,
                    horizontalAlignment: "center",
                });
                sheet.range(dataInfo.UserName).merged(false).style({
                    fill: "BCEAD5",
                    bold: true,
                    horizontalAlignment: "center",
                });
                sheet.range(dataInfo.FilmName).merged(false).style({
                    fill: "BCEAD5",
                    bold: true,
                    horizontalAlignment: "center",
                });
                sheet.range(dataInfo.Status).merged(false).style({
                    fill: "BCEAD5",
                    bold: true,
                    horizontalAlignment: "center",
                });
                sheet.range(dataInfo.TotalPrice).merged(false).style({
                    fill: "BCEAD5",
                    bold: true,
                    horizontalAlignment: "center",
                });
                sheet.range(dataInfo.CreateAt).merged(false).style({
                    fill: "BCEAD5",
                    bold: true,
                    horizontalAlignment: "center",
                });

            });

            return workbook
                .outputAsync()
                .then((workbookBlob) => URL.createObjectURL(workbookBlob));
        });
    };

    return (
        <Button variant="success" onClick={(e) => createDownloadData(csvData, fileName, buttonName, headerFile)} className="ant-btn ant-btn-primary">
            <a>
                <i className="btn btn-success" style={{ fontSize: '100%', padding: '5px' }}>  </i>
                {buttonName}
            </a>
        </Button>
    )
}