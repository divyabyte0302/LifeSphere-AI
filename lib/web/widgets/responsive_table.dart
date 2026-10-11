import 'package:flutter/material.dart';

class ResponsiveTable<T> extends StatelessWidget {
  final List<String> columns;
  final List<T> data;
  final List<Widget> Function(T item) buildCells;

  const ResponsiveTable({
    Key? key,
    required this.columns,
    required this.data,
    required this.buildCells,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: ConstrainedBox(
        constraints: BoxConstraints(minWidth: MediaQuery.of(context).size.width * 0.7),
        child: DataTable(
          headingRowColor: MaterialStateProperty.all(theme.colorScheme.surfaceVariant.withOpacity(0.3)),
          headingTextStyle: theme.textTheme.labelMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.onSurface,
          ),
          columns: columns
              .map((col) => DataColumn(label: Text(col)))
              .toList(),
          rows: data.map((item) {
            final cells = buildCells(item);
            return DataRow(
              cells: cells.map((w) => DataCell(w)).toList(),
            );
          }).toList(),
        ),
      ),
    );
  }
}
