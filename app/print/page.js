export default function PrintPage({ searchParams }) {
  const name = searchParams.name || '';
  const job = searchParams.job || '';
  const computerNo = searchParams.computerNo || '';
  const days = searchParams.days || '';

  return (
    <html lang="ar" dir="rtl">
      <head>
        <style>{`
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px 50px;
            color: #000;
            background: #fff;
          }

          .header {
            text-align: center;
            margin-bottom: 35px;
            line-height: 1.8;
            font-size: 28px;
            font-weight: 700;
          }

          .title {
            text-align: center;
            font-size: 30px;
            font-weight: 700;
            margin-bottom: 30px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin-bottom: 30px;
          }

          th, td {
            border: 2px solid #000;
            text-align: center;
            vertical-align: middle;
            padding: 12px 8px;
            font-size: 24px;
          }

          th {
            background: #eeeeee;
            font-weight: 700;
          }

          .body-text {
            font-size: 28px;
            line-height: 2;
            text-align: right;
            margin-top: 20px;
          }

          .body-text p {
            margin: 0 0 18px 0;
          }

          .signatures {
            margin-top: 80px;
            display: flex;
            justify-content: space-between;
            gap: 40px;
            font-size: 26px;
            font-weight: 700;
          }

          .signatures div {
            width: 45%;
            text-align: center;
          }
        `}</style>
      </head>
      <body>
        <div className="header">
          <div>تجمع جدة الصحي الأول</div>
          <div>Jeddah First Health Cluster</div>
          <div>مستشفى الليث العام</div>
          <div>Allith General Hospital</div>
        </div>

        <div className="title">مشهد</div>

        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الوظيفة</th>
              <th>رقم الكمبيوتر</th>
              <th>عدد أيام التكليف</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{name}</td>
              <td>{job}</td>
              <td>{computerNo}</td>
              <td>{days}</td>
            </tr>
          </tbody>
        </table>

        <div className="body-text">
          <p>تشهد إدارة / قسم</p>
          <p>بأن الموظف المحرر اسمه وبياناته أعلاه قد أتم مهمة التكليف لعيد الفطر المبارك لعام 1447هـ.</p>
          <p>والله الموفق.</p>
        </div>

        <div className="signatures">
          <div>مدير / رئيس القسم</div>
          <div>مدير الموارد البشرية بمستشفى الليث العام</div>
        </div>
      </body>
    </html>
  );
}
