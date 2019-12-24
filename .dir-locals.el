((nil . ((js-mode . t)
         (eval . (eval-after-load 'js-mode
                   '(progn
                      (add-hook 'js-mode-hook #'add-node-modules-path)
                      (add-hook 'js-mode-hook #'prettier-js-mode)
                      (add-hook 'after-save-hook #'eslint-fix)))))))
